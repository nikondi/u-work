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
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('worker_id')->nullable();
            $table->foreign('worker_id', 'FK_worker_address')->references('id')->on('workers')->nullOnDelete()->cascadeOnUpdate();
            $table->string('city', 50);
            $table->string('street', 100);
            $table->string('house', 10);
            $table->unsignedTinyInteger('entrance')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('addresses');
    }
};
