<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeliveryTracking extends Model
{
    use HasFactory;

    protected $table = 'delivery_tracking';

    protected $fillable = [
        'order_id',
        'delivery_person_id',
        'delivery_status',
        'delivery_date',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'delivery_date' => 'datetime',
        ];
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function deliveryPerson(): BelongsTo
    {
        return $this->belongsTo(User::class, 'delivery_person_id');
    }

    // ─── Helper Methods ───────────────────────────────────────────────────────

    /**
     * A failed delivery must be resolved by either:
     *  - Transitioning to 'Returned'
     *  - Re-assigning ('Assigned') for a retry
     *
     * This helper validates allowed status transitions.
     */
    public function canTransitionTo(string $newStatus): bool
    {
        $allowed = [
            'Assigned'       => ['Picked Up'],
            'Picked Up'      => ['On The Way'],
            'On The Way'     => ['Delivered', 'Failed Delivery'],
            'Failed Delivery'=> ['Returned', 'Assigned'],
            'Delivered'      => [],
            'Returned'       => [],
        ];

        return in_array($newStatus, $allowed[$this->delivery_status] ?? []);
    }

    public function isDelivered(): bool
    {
        return $this->delivery_status === 'Delivered';
    }

    public function hasFailed(): bool
    {
        return $this->delivery_status === 'Failed Delivery';
    }
}
