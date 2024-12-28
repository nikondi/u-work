<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::disableForeignKeyConstraints();

        Schema::dropIfExists('addresses');
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->string('city', 50);
            $table->string('street', 100);
            $table->string('house', 10);
        });

        Schema::enableForeignKeyConstraints();
    }

    public function down(): void
    {
    }
};
