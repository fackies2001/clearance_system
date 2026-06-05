<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('clearances', function (Blueprint $table) {
            // Missing columns from your controller
            $table->string('middle_name')->nullable()->after('first_name');
            $table->string('fingerprint_status')->nullable()->after('pdf_path');
            $table->string('workflow_status')->default('pending')->after('status');
            $table->string('hit_resolution')->nullable()->after('workflow_status');
            $table->text('hit_notes')->nullable()->after('hit_resolution');
            $table->text('admin_remarks')->nullable()->after('hit_notes');
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete()->after('admin_remarks');
            $table->timestamp('reviewed_at')->nullable()->after('reviewed_by');

            // Payment columns
            $table->string('payment_status')->default('unpaid')->after('reviewed_at');
            $table->string('payment_method')->nullable()->after('payment_status');
            $table->string('payment_reference')->nullable()->after('payment_method');
            $table->decimal('payment_amount', 8, 2)->default(150.00)->after('payment_reference');
            $table->timestamp('paid_at')->nullable()->after('payment_amount');
        });
    }

    public function down(): void
    {
        Schema::table('clearances', function (Blueprint $table) {
            $table->dropColumn([
                'middle_name',
                'fingerprint_status',
                'workflow_status',
                'hit_resolution',
                'hit_notes',
                'admin_remarks',
                'reviewed_by',
                'reviewed_at',
                'payment_status',
                'payment_method',
                'payment_reference',
                'payment_amount',
                'paid_at',
            ]);
        });
    }
};
