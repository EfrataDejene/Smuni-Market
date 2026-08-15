<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Snapshot of each product's price at the time of checkout.
     * The price column preserves what the customer actually paid regardless
     * of future product price changes.
     */
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            // RESTRICT: do not allow deleting a product that exists in historical orders
            $table->foreignId('product_id')->constrained('products')->restrictOnDelete();
            $table->unsignedInteger('quantity');
            // Price snapshot at checkout time (not the current product price)
            $table->decimal('price', 12, 2);
            $table->timestamps();

            $table->index('order_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
