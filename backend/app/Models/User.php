<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'role',
        'status',
        'address',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }

    // ─── Helper Methods ───────────────────────────────────────────────────────

    public function isAdmin(): bool
    {
        return $this->role === 'Admin';
    }

    public function isSeller(): bool
    {
        return $this->role === 'Seller';
    }

    public function isCustomer(): bool
    {
        return $this->role === 'Customer';
    }

    public function isDelivery(): bool
    {
        return $this->role === 'Delivery';
    }

    public function isActive(): bool
    {
        return $this->status === 'Active';
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    /** Products listed by this seller */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'seller_id');
    }

    /** Orders placed by this customer */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    /** Reviews written by this customer */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    /** Shopping cart belonging to this customer */
    public function cart(): HasOne
    {
        return $this->hasOne(Cart::class);
    }

    /** Deliveries assigned to this delivery personnel */
    public function assignedDeliveries(): HasMany
    {
        return $this->hasMany(DeliveryTracking::class, 'delivery_person_id');
    }
}
