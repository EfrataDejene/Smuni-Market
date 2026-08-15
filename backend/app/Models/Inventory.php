<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Inventory extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'quantity',
        'low_stock_threshold',
        'stock_status',
    ];

    protected $table = 'inventory';

    // ─── Relationships ────────────────────────────────────────────────────────

    /**
     * CRITICAL: This model is the single source of truth for stock.
     * When updating quantity, always call syncStockStatus() afterwards.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    // ─── Helper Methods ───────────────────────────────────────────────────────

    /**
     * Recalculates and saves stock_status based on current quantity.
     * Call this every time quantity is updated.
     */
    public function syncStockStatus(): void
    {
        if ($this->quantity <= 0) {
            $this->stock_status = 'Out';
        } elseif ($this->quantity <= $this->low_stock_threshold) {
            $this->stock_status = 'Low';
        } else {
            $this->stock_status = 'Available';
        }
        $this->save();
    }

    public function isAvailable(): bool
    {
        return $this->quantity > 0;
    }

    public function hasSufficientStock(int $requested): bool
    {
        return $this->quantity >= $requested;
    }
}
