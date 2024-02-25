<?php

use App\Models\Objects;
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
        Schema::create('object_nets', function (Blueprint $table) {
            $table->id();
            $table->string('subnet'); // Подсеть
            $table->string('wan')->nullable(); // WAN
            $table->string('pppoe_cred')->nullable(); // Учётка PPPoE
            $table->foreignIdFor(Objects::class)->constrained()->cascadeOnUpdate()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('object_nets');
    }
};
