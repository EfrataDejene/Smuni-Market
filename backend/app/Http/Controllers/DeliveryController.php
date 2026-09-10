<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Order;
use App\Models\DeliveryTracking;
use App\Models\Payment;
use App\Models\Inventory;
use App\Models\OrderItem;
use App\Services\GmailMailerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DeliveryController extends Controller
{
    /**
     * Get Delivery Fleet & Drivers with live workload stats.
     */
    public function getFleet(): JsonResponse
    {
        $drivers = User::where('role', 'delivery_personnel')
            ->orderBy('name')
            ->get()
            ->map(function ($driver) {
                $assignedCount = DeliveryTracking::where('delivery_person_id', $driver->id)
                    ->whereIn('delivery_status', ['Assigned', 'Picked Up', 'On The Way'])
                    ->count();

                $deliveredCount = DeliveryTracking::where('delivery_person_id', $driver->id)
                    ->where('delivery_status', 'Delivered')
                    ->count();

                return [
                    'id' => $driver->id,
                    'userId' => $driver->id,
                    'name' => $driver->name,
                    'email' => $driver->email,
                    'phone' => $driver->phone,
                    'role' => 'Delivery',
                    'status' => ucfirst($driver->status),
                    'address' => $driver->address,
                    'emailVerified' => !empty($driver->email_verified_at),
                    'activeDeliveries' => $assignedCount,
                    'deliveredCount' => $deliveredCount,
                    'rating' => 4.9,
                    'createdAt' => $driver->created_at ? $driver->created_at->format('Y-m-d') : null,
                ];
            });

        return response()->json([
            'success' => true,
            'fleet' => $drivers,
            'total_drivers' => $drivers->count(),
        ]);
    }

    /**
     * Admin creates a new delivery courier with Gmail and Password.
     */
    public function createDeliveryPerson(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'phone' => 'required|string|max:50',
            'zone' => 'nullable|string|max:100',
            'vehicle_type' => 'nullable|string|max:100',
            'plate_number' => 'nullable|string|max:100',
            'status' => 'nullable|string|in:active,inactive,Active,Inactive',
            'send_email' => 'nullable|boolean',
        ]);

        $zone = $request->input('zone', 'Addis Ababa Central');
        $vehicleType = $request->input('vehicle_type', 'Motorbike');
        $plateNumber = $request->input('plate_number', 'AA-NEW');
        $addressMeta = "Zone: {$zone} | Vehicle: {$vehicleType} | Plate: {$plateNumber}";

        $rawPassword = $validated['password'];

        $user = User::create([
            'name' => $validated['name'],
            'email' => strtolower(trim($validated['email'])),
            'password' => Hash::make($rawPassword),
            'phone' => $validated['phone'],
            'role' => 'delivery_personnel',
            'status' => strtolower($request->input('status', 'active')),
            'address' => $addressMeta,
            'email_verified_at' => now(), // Pre-verified by Admin so driver can log in immediately
        ]);

        // Optionally send welcome email with credentials
        $mailResult = null;
        if ($request->boolean('send_email', true)) {
            $mailResult = GmailMailerService::sendDeliveryCredentialsEmail(
                $user->email,
                $user->name,
                $rawPassword,
                $zone,
                "{$vehicleType} ({$plateNumber})",
                $user->phone
            );
        }

        GmailMailerService::logToConsole('SUCCESS', "🚴 Admin registered delivery courier: {$user->email} (Password: {$rawPassword}, Zone: {$zone})");

        return response()->json([
            'success' => true,
            'message' => "Delivery courier '{$user->name}' created successfully with credentials.",
            'user' => [
                'id' => $user->id,
                'userId' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => 'Delivery',
                'status' => ucfirst($user->status),
                'address' => $user->address,
                'emailVerified' => true,
                'passwordHash' => $rawPassword, // returned for frontend demo/local fallback sync
                'activeDeliveries' => 0,
                'deliveredCount' => 0,
                'rating' => 5.0,
                'createdAt' => now()->format('Y-m-d'),
            ],
            'mail_result' => $mailResult,
        ], 201);
    }

    /**
     * Assign / Reassign delivery person to an order.
     */
    public function assign(Request $request): JsonResponse
    {
        $request->validate([
            'order_id' => 'required|integer',
            'delivery_person_id' => 'required|integer|exists:users,id',
            'notes' => 'nullable|string',
        ]);

        $orderId = $request->order_id;
        $deliveryPersonId = $request->delivery_person_id;

        $tracking = DeliveryTracking::updateOrCreate(
            ['order_id' => $orderId],
            [
                'delivery_person_id' => $deliveryPersonId,
                'delivery_status' => 'Assigned',
                'notes' => $request->input('notes', "Assigned to delivery driver ID #{$deliveryPersonId}"),
            ]
        );

        $driver = User::find($deliveryPersonId);

        GmailMailerService::logToConsole('INFO', "📦 Order #{$orderId} assigned to driver {$driver?->name} ({$driver?->email})");

        return response()->json([
            'success' => true,
            'message' => "Order #{$orderId} successfully assigned to driver {$driver?->name}.",
            'tracking' => $tracking,
        ]);
    }

    /**
     * Update delivery status (Assigned -> Picked Up -> On The Way -> Delivered -> Failed Delivery -> Returned).
     */
    public function updateStatus(Request $request, $orderId): JsonResponse
    {
        $request->validate([
            'delivery_status' => 'required|string|in:Assigned,Picked Up,On The Way,Delivered,Failed Delivery,Returned',
            'notes' => 'nullable|string',
        ]);

        $status = $request->delivery_status;
        $notes = $request->notes;

        $tracking = DeliveryTracking::where('order_id', $orderId)->first();

        if (!$tracking) {
            $tracking = DeliveryTracking::create([
                'order_id' => $orderId,
                'delivery_status' => $status,
                'delivery_date' => $status === 'Delivered' ? now() : null,
                'notes' => $notes ?: "Status set to {$status}",
            ]);
        } else {
            $tracking->delivery_status = $status;
            if ($status === 'Delivered') {
                $tracking->delivery_date = now();
            }
            if ($notes) {
                $tracking->notes = $notes;
            }
            $tracking->save();
        }

        // Side effect 1: If Delivered and order payment was COD, mark Payment as Paid
        if ($status === 'Delivered') {
            Payment::where('order_id', $orderId)
                ->where('payment_method', 'COD')
                ->update([
                    'payment_status' => 'Paid',
                    'transaction_reference' => "TXN-COD-COLLECTED-{$orderId}",
                    'payment_date' => now(),
                ]);
        }

        // Side effect 2: If Returned, restore inventory stock
        if ($status === 'Returned') {
            $orderItems = OrderItem::where('order_id', $orderId)->get();
            foreach ($orderItems as $item) {
                $inv = Inventory::where('product_id', $item->product_id)->first();
                if ($inv) {
                    $inv->quantity += $item->quantity;
                    $inv->save();
                }
            }
            Order::where('id', $orderId)->update(['order_status' => 'Cancelled']);
        }

        GmailMailerService::logToConsole('INFO', "🚚 Delivery tracking updated for Order #{$orderId}: {$status}");

        return response()->json([
            'success' => true,
            'message' => "Delivery status updated to '{$status}'.",
            'tracking' => $tracking,
        ]);
    }

    /**
     * Admin directly resets password for a courier or user.
     */
    public function resetPassword(Request $request, $userId): JsonResponse
    {
        $request->validate([
            'password' => 'required|string|min:6',
        ]);

        $user = User::findOrFail($userId);
        $newPass = $request->password;

        $user->password = Hash::make($newPass);
        $user->save();

        GmailMailerService::logToConsole('SUCCESS', "🔑 Admin reset password for User #{$user->id} ({$user->email})");

        return response()->json([
            'success' => true,
            'message' => "Password for '{$user->name}' ({$user->email}) updated successfully.",
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'name' => $user->name,
            ],
        ]);
    }
}
