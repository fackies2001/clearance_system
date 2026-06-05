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
        Schema::create('biometrics', function (Blueprint $table) {
            $table->id();

            // DITO BOSS: Siguraduhing 'clearances' ang nakalagay saconstrained() 
            // para malaman ng Laravel na nakakabit ito sa clearances table mo
            $table->foreignId('clearance_id')->constrained('clearances')->onDelete('cascade');

            $table->longText('photo_path')->nullable();
            $table->string('fingerprint_status')->default('PENDING');
            $table->string('verified_by_admin')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('biometrics');
    }
};
