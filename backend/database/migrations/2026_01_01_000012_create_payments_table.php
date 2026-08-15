<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * IMPORTANT: One order can have MULTIPLE payment attempts (e.g. a failed Chapa
     * attempt followed by a successful retry). Each attempt gets its own row.
     *
     * payment_status is INDEPENDENT from order_status and delivery_status.
     *
     * Statuses:
     *   Pending  → initial state for both COD and Chapa
     *   Paid     → only set AFTER server-side Chapa verification OR COD collection
     *   Failed   → Chapa transaction verification returned failure
     *   Refunded → admin-initiated refund
     *
     * For Chapa: NEVER mark Paid from frontend callback alone.
     * Always verify server-to-server via Chapa's verification API before updating.
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->enum('payment_method', ['COD', 'Chapa']);
            // Chapa transaction reference (null for COD until collected)
            $table->string('transaction_reference', 255)->unique()->nullable();
            $table->decimal('amount', 12, 2);
            $table->enum('payment_status', ['Pending', 'Paid', 'Failed', 'Refunded'])->default('Pending');
            $table->timestamp('payment_date')->nullable();
            $table->timestamps();

            $table->index('order_id');
            $table->index('payment_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
