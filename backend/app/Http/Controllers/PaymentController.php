<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Order;
use App\Models\Inventory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    /**
     * Get all payment transactions with order and customer relations.
     */
    public function index(): JsonResponse
    {
        $payments = Payment::with([
            'order.customer',
            'order.items.product',
            'order.delivery.deliveryPerson'
        ])->orderBy('id', 'desc')->get();

        return response()->json([
            'success' => true,
            'count' => $payments->count(),
            'data' => $payments
        ]);
    }

    /**
     * Update payment status (e.g. Paid, Pending, Failed, Refunded).
     */
    public function updateStatus(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'payment_status' => 'required|in:Pending,Paid,Failed,Refunded',
            'notes' => 'nullable|string',
        ]);

        $payment = Payment::with('order.items')->find($id);

        if (!$payment) {
            return response()->json([
                'success' => false,
                'message' => "Payment #{$id} not found."
            ], 404);
        }

        $payment->payment_status = $validated['payment_status'];
        if ($validated['payment_status'] === 'Paid' && !$payment->payment_date) {
            $payment->payment_date = now();
        }
        $payment->save();

        // Synchronize with Order if payment becomes Paid
        if ($validated['payment_status'] === 'Paid' && $payment->order) {
            if ($payment->order->order_status === 'Pending') {
                $payment->order->order_status = 'Confirmed';
                $payment->order->save();
            }
        }

        return response()->json([
            'success' => true,
            'message' => "Payment #{$id} status updated to {$validated['payment_status']}.",
            'payment' => $payment
        ]);
    }

    /**
     * Process refund for a payment.
     */
    public function refund(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'reason' => 'nullable|string',
            'restock' => 'nullable|boolean',
        ]);

        $payment = Payment::with(['order.items'])->find($id);

        if (!$payment) {
            return response()->json([
                'success' => false,
                'message' => "Payment #{$id} not found."
            ], 404);
        }

        DB::beginTransaction();
        try {
            $payment->payment_status = 'Refunded';
            $payment->save();

            if ($payment->order) {
                $payment->order->order_status = 'Cancelled';
                $payment->order->save();

                // Restock inventory if requested or by default
                $restock = $request->input('restock', true);
                if ($restock && $payment->order->items) {
                    foreach ($payment->order->items as $item) {
                        $inventory = Inventory::where('product_id', $item->product_id)->first();
                        if ($inventory) {
                            $inventory->quantity += $item->quantity;
                            $inventory->stock_status = $inventory->quantity > $inventory->low_stock_threshold ? 'Available' : 'Low';
                            $inventory->save();
                        }
                    }
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Payment #{$id} refunded successfully.",
                'payment' => $payment
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Payment refund error: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => "Failed to process refund: " . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Re-verify transaction (For Chapa or COD reconciliation).
     */
    public function verify(Request $request, $id): JsonResponse
    {
        $payment = Payment::with('order')->find($id);

        if (!$payment) {
            return response()->json([
                'success' => false,
                'message' => "Payment #{$id} not found."
            ], 404);
        }

        $payment->payment_status = 'Paid';
        if (!$payment->payment_date) {
            $payment->payment_date = now();
        }
        $payment->save();

        if ($payment->order && $payment->order->order_status === 'Pending') {
            $payment->order->order_status = 'Confirmed';
            $payment->order->save();
        }

        return response()->json([
            'success' => true,
            'message' => "Payment #{$id} verified and settled as Paid.",
            'payment' => $payment
        ]);
    }
}
