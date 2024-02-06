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
        Schema::table('clients', function (Blueprint $table) {
            $table->dropColumn('floor');
        });
        Schema::table('addresses', function (Blueprint $table) {
            $table->unsignedTinyInteger('per_floor')->default(6)->after('entrance');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            $table->unsignedTinyInteger('floor')->nullable();
        });
        Schema::table('addresses', function (Blueprint $table) {
            $table->dropColumn('per_floor');
        });
    }
};
