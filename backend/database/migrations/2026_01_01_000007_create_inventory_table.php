<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * CRITICAL: This is the SINGLE SOURCE OF TRUTH for all stock quantities.
     * The products table does NOT and must NOT contain any quantity field.
     * All checkout operations must lock rows in this table using SELECT FOR UPDATE
     * to prevent overselling under concurrent requests.
     */
    public function up(): void
    {
        Schema::create('inventory', function (Blueprint $table) {
            $table->id();
            // One inventory record per product — enforced by the unique constraint
            $table->foreignId('product_id')->unique()->constrained('products')->cascadeOnDelete();
            $table->unsignedInteger('quantity')->default(0);
            $table->unsignedInteger('low_stock_threshold')->default(5);
            // Computed status; updated by application logic whenever quantity changes
            $table->enum('stock_status', ['Available', 'Low', 'Out'])->default('Out');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory');
    }
};
