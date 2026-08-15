<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * IMPORTANT: delivery_status is INDEPENDENT from order_status and payment_status.
     *
     * Allowed transitions:
     *   Assigned → Picked Up → On The Way → Delivered
     *                                      → Failed Delivery → Returned
     *                                      → Failed Delivery → Assigned (retry)
     *
     * A Failed Delivery MUST be resolved (Returned or Retried).
     * The application layer enforces this rule; this migration captures the states.
     */
    public function up(): void
    {
        Schema::create('delivery_tracking', function (Blueprint $table) {
            $table->id();
            // One tracking record per order
            $table->foreignId('order_id')->unique()->constrained('orders')->cascadeOnDelete();
            // Nullable: assigned later by admin after order confirmation
            $table->foreignId('delivery_person_id')
                ->nullable()
                ->constrained('users')
                ->restrictOnDelete();
            $table->enum('delivery_status', [
                'Assigned',
                'Picked Up',
                'On The Way',
                'Delivered',
                'Failed Delivery',
                'Returned',
            ])->default('Assigned');
            $table->timestamp('delivery_date')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('delivery_person_id');
            $table->index('delivery_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('delivery_tracking');
    }
};
