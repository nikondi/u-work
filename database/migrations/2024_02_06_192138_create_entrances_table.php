<?php

use App\Models\Address;
use App\Models\Client;
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
        Schema::create('entrances', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('address_id');
            $table->foreign('address_id', 'FK_entrance_address')->references('id')->on('addresses')->noActionOnDelete()->cascadeOnUpdate();

            $table->unsignedTinyInteger('entrance')->nullable();
            $table->unsignedTinyInteger('per_floor')->default(6);

            $table->unsignedBigInteger('worker_id')->nullable();
            $table->foreign('worker_id', 'FK_entrance_worker')->references('id')->on('users')->nullOnDelete()->cascadeOnUpdate();
        });
        $addresses = Address::select(['id', 'city', 'street', 'house'])->whereRaw("id IN (SELECT min(id)
            FROM addresses
            GROUP BY city, street, house)")->get();
        foreach($addresses as $address) {
            $a = Address::where(['city' => $address->city, 'street' => $address->street, 'house' => $address->house])->get();
            foreach($a as $item) {
                Entrance::create([
                    'id' => $item->id,
                    'address_id' => $address->id,
                    'entrance' => $item->entrance,
                ]);
            }
        }
        Schema::table('clients', function (Blueprint $table) {
            $table->dropForeign('FK_client_address');
            $table->foreign('address_id', 'FK_client_address')->references('id')->on('entrances')->nullOnDelete()->cascadeOnUpdate();
        });
        Schema::table('requests', function (Blueprint $table) {
            $table->dropForeign('FK_request_address');
            $table->foreign('address_id', 'FK_request_address')->references('id')->on('entrances')->noActionOnDelete()->cascadeOnUpdate();
        });
        Address::whereRaw('id NOT IN (SELECT address_id FROM entrances)')->delete();
        Schema::table('addresses', function (Blueprint $table) {
//            $table->dropUnique('addresses_city_street_house_entrance_unique');
            $table->unique(['city', 'street', 'house'], 'UNIQUE_ADDRESS');
            $table->dropForeign('FK_worker_address');
            $table->dropColumn(['worker_id', 'entrance']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('addresses', function (Blueprint $table) {
            $table->unsignedBigInteger('worker_id')->nullable();
            $table->foreign('worker_id', 'FK_worker_address')->references('id')->on('users')->nullOnDelete()->cascadeOnUpdate();
        });
        Schema::table('clients', function (Blueprint $table) {
            $table->dropForeign('FK_client_address');
            $table->foreign('address_id', 'FK_client_address')->references('id')->on('addresses')->nullOnDelete()->cascadeOnUpdate();
        });
        Schema::table('requests', function (Blueprint $table) {
            $table->dropForeign('FK_request_address');
            $table->foreign('address_id', 'FK_request_address')->references('id')->on('addresses')->noActionOnDelete()->cascadeOnUpdate();
        });
        Schema::dropIfExists('entrances');
    }
};
