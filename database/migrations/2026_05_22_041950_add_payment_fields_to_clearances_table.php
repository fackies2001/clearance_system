<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('clearances', function (Blueprint $table) {
            // Only add columns if they don't already exist (safe for re-runs)
            if (!Schema::hasColumn('clearances', 'payment_status')) {
                $table->string('payment_status')->default('unpaid')->after('reviewed_at');
            }
            if (!Schema::hasColumn('clearances', 'payment_method')) {
                $table->string('payment_method')->nullable()->after('payment_status');
            }
            if (!Schema::hasColumn('clearances', 'payment_reference')) {
                $table->string('payment_reference')->nullable()->after('payment_method');
            }
            if (!Schema::hasColumn('clearances', 'payment_amount')) {
                $table->decimal('payment_amount', 8, 2)->default(150.00)->after('payment_reference');
            }
            if (!Schema::hasColumn('clearances', 'paid_at')) {
                $table->timestamp('paid_at')->nullable()->after('payment_amount');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('clearances', function (Blueprint $table) {
            $columns = ['payment_status', 'payment_method', 'payment_reference', 'payment_amount', 'paid_at'];
            $existing = array_filter($columns, fn($col) => Schema::hasColumn('clearances', $col));
            if (!empty($existing)) {
                $table->dropColumn($existing);
            }
        });
    }
};
