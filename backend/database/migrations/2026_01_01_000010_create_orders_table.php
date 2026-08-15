<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * IMPORTANT: order_status is INDEPENDENT from payment_status and delivery_status.
     * These three states must never be merged or overwritten by one another.
     *
     * Order statuses: Pending → Confirmed → Cancelled
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            // RESTRICT prevents deleting a user who still has active orders
            $table->foreignId('user_id')->constrained('users')->restrictOnDelete();
            $table->timestamp('order_date')->useCurrent();
            $table->decimal('total_amount', 12, 2);
            $table->enum('order_status', ['Pending', 'Confirmed', 'Cancelled'])->default('Pending');
            $table->text('delivery_address');
            $table->timestamps();

            $table->index('user_id');
            $table->index('order_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
