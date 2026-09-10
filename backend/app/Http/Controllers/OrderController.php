<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Inventory;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    /**
     * Get all orders with relations.
     */
    public function index(): JsonResponse
    {
        return response()->json(Order::with([
            'items.product.images',
            'payments',
            'delivery.deliveryPerson',
            'customer'
        ])->orderBy('id', 'desc')->get());
    }

    /**
     * Get single order by ID with full live tracking and relations.
     */
    public function show($id): JsonResponse
    {
        $order = Order::with([
            'items.product.images',
            'payments',
            'delivery.deliveryPerson',
            'customer'
        ])->find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => "Order #{$id} not found."
            ], 404);
        }

        return response()->json([
            'success' => true,
            'order' => $order
        ]);
    }

    /**
     * Update order status (Pending, Confirmed, Cancelled).
     */
    public function updateStatus(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'order_status' => 'required|in:Pending,Confirmed,Cancelled',
        ]);

        $order = Order::with(['items', 'payments'])->find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => "Order #{$id} not found."
            ], 404);
        }

        DB::beginTransaction();
        try {
            $prevStatus = $order->order_status;
            $newStatus = $validated['order_status'];
            $order->order_status = $newStatus;
            $order->save();

            // If cancelling order, restock inventory items and mark payment as Refunded
            if ($newStatus === 'Cancelled' && $prevStatus !== 'Cancelled') {
                if ($order->items) {
                    foreach ($order->items as $item) {
                        $inventory = Inventory::where('product_id', $item->product_id)->first();
                        if ($inventory) {
                            $inventory->quantity += $item->quantity;
                            $inventory->stock_status = $inventory->quantity > $inventory->low_stock_threshold ? 'Available' : 'Low';
                            $inventory->save();
                        }
                    }
                }

                // Update payment to Refunded if exists
                if ($order->payments) {
                    foreach ($order->payments as $payment) {
                        if ($payment->payment_status !== 'Refunded') {
                            $payment->payment_status = 'Refunded';
                            $payment->save();
                        }
                    }
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Order #{$id} updated to {$newStatus}.",
                'order' => $order->load(['items.product.images', 'payments', 'delivery.deliveryPerson', 'customer'])
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Order status update failed: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => "Failed to update order: " . $e->getMessage()
            ], 500);
        }
    }
}
