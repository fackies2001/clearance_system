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
            if (!Schema::hasColumn('clearances', 'user_id')) {
                $table->foreignId('user_id')->nullable()->after('id')->constrained()->onDelete('cascade');
            }
            if (!Schema::hasColumn('clearances', 'released_at')) {
                $table->timestamp('released_at')->nullable()->after('paid_at');
            }
            if (!Schema::hasColumn('clearances', 'clearance_number')) {
                $table->string('clearance_number')->nullable()->after('tracking_no');
            }
            if (!Schema::hasColumn('clearances', 'email_notified_at')) {
                $table->timestamp('email_notified_at')->nullable()->after('released_at');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('clearances', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn(['user_id', 'released_at', 'clearance_number', 'email_notified_at']);
        });
    }
};
