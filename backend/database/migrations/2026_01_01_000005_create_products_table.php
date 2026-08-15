<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Products table. Stock quantity lives in the inventory table — NOT here.
     * The products table only holds catalog/description data.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            // seller_id references the users table (a Seller role user)
            $table->foreignId('seller_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('category_id')->constrained('categories')->restrictOnDelete();
            $table->foreignId('brand_id')->nullable()->constrained('brands')->restrictOnDelete();
            $table->string('product_name', 255);
            $table->text('description')->nullable();
            // Price stored with 2 decimal places; up to 10 digits total
            $table->decimal('price', 12, 2);
            // Discount as a percentage (0.00 to 100.00)
            $table->decimal('discount', 5, 2)->default(0.00);
            $table->enum('status', ['Active', 'Inactive'])->default('Active');
            $table->timestamps();

            // Index for fast seller product lookups
            $table->index('seller_id');
            $table->index('category_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
