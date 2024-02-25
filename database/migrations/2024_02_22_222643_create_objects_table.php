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
        Schema::create('objects', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // Тип
            $table->string('router')->nullable(); // Маршрутизатор
            $table->boolean('internet')->default(false); // Интернет

            $table->integer('sip')->nullable(); // Модель камеры
            $table->string('minipc_model')->nullable(); // Модель камеры
            $table->string('intercom_model')->nullable(); // Модель домофона

            $table->string('cubic_ip')->nullable(); // IP кубика

            $table->string('comment')->nullable(); // Примечание

            $table->morphs('objectable');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('objects');
    }
};
