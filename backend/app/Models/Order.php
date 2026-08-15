<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'order_date',
        'total_amount',
        'order_status',
        'delivery_address',
    ];

    protected function casts(): array
    {
        return [
            'order_date'   => 'datetime',
            'total_amount' => 'decimal:2',
        ];
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * One order can have MULTIPLE payment attempts.
     * Use latestPayment() to get the most recent one.
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function latestPayment(): HasOne
    {
        return $this->hasOne(Payment::class)->latestOfMany();
    }

    /**
     * One delivery tracking record per order.
     */
    public function delivery(): HasOne
    {
        return $this->hasOne(DeliveryTracking::class);
    }
}
