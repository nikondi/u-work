<?php

use App\Models\Entrance;
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
        Schema::create('entrance_intercoms', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Entrance::class)
                ->constrained()
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
            $table->string('model');
            $table->string('version')->nullable();
            $table->string('calling_panel')->nullable();
            $table->string('door_type')->default('uniphone');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entrance_intercoms');
    }
};
