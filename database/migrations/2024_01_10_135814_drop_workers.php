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
        Schema::table('addresses', function (Blueprint $table) {
            $table->dropForeign('FK_worker_address');
            $table->foreign('worker_id', 'FK_worker_address')->references('id')->on('users')->nullOnDelete()->cascadeOnUpdate();
        });
        Schema::dropIfExists('workers');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('workers', function (Blueprint $table) {
            $table->id();
            $table->string('name', 90);
            $table->timestamps();
        });

        Schema::table('addresses', function (Blueprint $table) {
            $table->dropForeign('FK_worker_address');
            $table->foreign('worker_id', 'FK_worker_address')->references('id')->on('workers')->nullOnDelete()->cascadeOnUpdate();
        });
    }
};
