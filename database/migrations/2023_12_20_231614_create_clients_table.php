<?php

use App\Models\Client;
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
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('address_id')->nullable();
            $table->foreign('address_id', 'FK_client_address')->references('id')->on('addresses')->nullOnDelete()->cascadeOnUpdate();
            $table->string('phone', 12);
            $table->string('phone_second', 12);
            $table->string('name', 90);
            $table->unsignedTinyInteger('status')->default(Client::STATUS_INVALID);
            $table->unsignedTinyInteger('floor')->nullable();
            $table->unsignedTinyInteger('apartment')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
