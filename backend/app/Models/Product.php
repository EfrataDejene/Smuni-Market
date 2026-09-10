<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'seller_id',
        'category_id',
        'brand_id',
        'name',
        'description',
        'price',
        'discount',
        'status',
        'features',
        'off_price',
    ];

    protected function casts(): array
    {
        return [
            'price'    => 'decimal:2',
            'discount' => 'decimal:2',
            'features' => 'array',
            'off_price' => 'decimal:2',
        ];
    }

    // ─── Helper Methods ───────────────────────────────────────────────────────

    /** Returns the effective selling price after applying the discount */
    public function effectivePrice(): float
    {
        return (float) $this->price * (1 - ($this->discount / 100));
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    /** The seller (User with role=Seller) who owns this product */
    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function primaryImage(): HasOne
    {
        return $this->hasOne(ProductImage::class)->where('is_primary', true);
    }

    /**
     * CRITICAL: This is the authoritative stock record for this product.
     * Never read or write stock from the products table itself.
     */
    public function inventory(): HasOne
    {
        return $this->hasOne(Inventory::class);
    }

    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }
}
