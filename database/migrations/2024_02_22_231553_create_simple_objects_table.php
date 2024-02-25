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
        Schema::create('simple_objects', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type');
            $table->unique(['name', 'type']);
            $table->string('city');
            $table->string('street')->nullable();
            $table->string('house')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('simple_objects');
    }
};
