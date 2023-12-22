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
        Schema::create('requests', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('client_id')->nullable();
            $table->foreign('client_id', 'FK_client_requests')->references('id')->on('clients')->noActionOnDelete()->cascadeOnUpdate();
            $table->string('client_name', 90)->nullable();
            $table->string('client_phone', 12);
            $table->string('client_phone_contact', 12)->nullable();

            $table->unsignedBigInteger('address_id')->nullable();
            $table->foreign('address_id', 'FK_request_address')->references('id')->on('addresses')->noActionOnDelete()->cascadeOnUpdate();
            $table->string('address', 128)->nullable();

            $table->string('content', 1024)->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('requests');
    }
};
