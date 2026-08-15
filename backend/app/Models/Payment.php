<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'payment_method',
        'transaction_reference',
        'amount',
        'payment_status',
        'payment_date',
    ];

    protected function casts(): array
    {
        return [
            'amount'       => 'decimal:2',
            'payment_date' => 'datetime',
        ];
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    // ─── Helper Methods ───────────────────────────────────────────────────────

    public function isPaid(): bool
    {
        return $this->payment_status === 'Paid';
    }

    public function isPending(): bool
    {
        return $this->payment_status === 'Pending';
    }

    public function isFailed(): bool
    {
        return $this->payment_status === 'Failed';
    }
}
