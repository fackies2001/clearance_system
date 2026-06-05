<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('clearances', function (Blueprint $table) {

            // ── Workflow Status ──
            $table->string('workflow_status')->default('pending')->after('status');

            // ── HIT Handling ──
            $table->string('hit_resolution')->nullable()->after('workflow_status');
            $table->text('hit_notes')->nullable()->after('hit_resolution');

            // ── Admin Audit Trail ──
            $table->unsignedBigInteger('reviewed_by')->nullable()->after('hit_notes');
            $table->timestamp('reviewed_at')->nullable()->after('reviewed_by');
            $table->text('admin_remarks')->nullable()->after('reviewed_at');

            // Foreign key
            $table->foreign('reviewed_by')->references('id')->on('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('clearances', function (Blueprint $table) {
            $table->dropForeign(['reviewed_by']);
            $table->dropColumn([
                'workflow_status',
                'hit_resolution',
                'hit_notes',
                'reviewed_by',
                'reviewed_at',
                'admin_remarks',
            ]);
        });
    }
};
