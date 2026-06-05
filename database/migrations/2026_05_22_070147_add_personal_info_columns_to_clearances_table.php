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
            // Personal Information
            if (!Schema::hasColumn('clearances', 'suffix')) {
                $table->string('suffix')->nullable()->after('last_name');
            }
            if (!Schema::hasColumn('clearances', 'date_of_birth')) {
                $table->date('date_of_birth')->nullable()->after('suffix');
            }
            if (!Schema::hasColumn('clearances', 'place_of_birth')) {
                $table->string('place_of_birth')->nullable()->after('date_of_birth');
            }
            if (!Schema::hasColumn('clearances', 'sex')) {
                $table->string('sex')->nullable()->after('place_of_birth');
            }
            if (!Schema::hasColumn('clearances', 'civil_status')) {
                $table->string('civil_status')->nullable()->after('sex');
            }
            if (!Schema::hasColumn('clearances', 'nationality')) {
                $table->string('nationality')->nullable()->after('civil_status');
            }

            // Present Address
            if (!Schema::hasColumn('clearances', 'present_street')) {
                $table->string('present_street')->nullable()->after('nationality');
            }
            if (!Schema::hasColumn('clearances', 'present_barangay')) {
                $table->string('present_barangay')->nullable()->after('present_street');
            }
            if (!Schema::hasColumn('clearances', 'present_city')) {
                $table->string('present_city')->nullable()->after('present_barangay');
            }
            if (!Schema::hasColumn('clearances', 'present_province')) {
                $table->string('present_province')->nullable()->after('present_city');
            }
            if (!Schema::hasColumn('clearances', 'present_zip')) {
                $table->string('present_zip')->nullable()->after('present_province');
            }

            // Permanent Address
            if (!Schema::hasColumn('clearances', 'permanent_street')) {
                $table->string('permanent_street')->nullable()->after('present_zip');
            }
            if (!Schema::hasColumn('clearances', 'permanent_barangay')) {
                $table->string('permanent_barangay')->nullable()->after('permanent_street');
            }
            if (!Schema::hasColumn('clearances', 'permanent_city')) {
                $table->string('permanent_city')->nullable()->after('permanent_barangay');
            }
            if (!Schema::hasColumn('clearances', 'permanent_province')) {
                $table->string('permanent_province')->nullable()->after('permanent_city');
            }
            if (!Schema::hasColumn('clearances', 'permanent_zip')) {
                $table->string('permanent_zip')->nullable()->after('permanent_province');
            }

            // Contact Information
            if (!Schema::hasColumn('clearances', 'mobile_number')) {
                $table->string('mobile_number')->nullable()->after('permanent_zip');
            }
            if (!Schema::hasColumn('clearances', 'email_address')) {
                $table->string('email_address')->nullable()->after('mobile_number');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('clearances', function (Blueprint $table) {
            $table->dropColumn([
                'suffix', 'date_of_birth', 'place_of_birth', 'sex', 'civil_status', 'nationality',
                'present_street', 'present_barangay', 'present_city', 'present_province', 'present_zip',
                'permanent_street', 'permanent_barangay', 'permanent_city', 'permanent_province', 'permanent_zip',
                'mobile_number', 'email_address'
            ]);
        });
    }
};
