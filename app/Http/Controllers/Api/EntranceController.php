<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateEntranceRequest;
use App\Http\Resources\ClientResource;
use App\Http\Resources\EntranceResource;
use App\Models\Client;
use App\Models\Entrance;
use App\Models\EntranceIntercom;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EntranceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Entrance $entrance)
    {
        $entrance->load('intercoms', 'object');
        return new EntranceResource($entrance);
    }

    public function getClients(Entrance $entrance) {
        return ClientResource::collection($entrance->clients()->orderByRaw('cast(apartment as unsigned)')->get());
    }

    /**
     * @throws Exception
     */
    public function addClients(Request $request) {
        $entrance_id = $request->get('entrance_id');
        $entrance = $request->get('entrance');
        $address_id = $request->get('address_id');
        $client_ids = $request->get('client_ids');

        if(empty($entrance_id)) {
            if(empty($entrance) || empty($address_id))
                throw new Exception('Пустые id и номер подъезда');

            for($i = $entrance; $i > 0 ; $i--) {
                $_entrance = Entrance::firstOrCreate([
                    'address_id' => $address_id,
                    'entrance' => $i,
                ]);
                if($i == $entrance)
                    $entrance_id = $_entrance->id;
            }
        }

        Client::whereIn('id', $client_ids)->update(['entrance_id' => $entrance_id]);
        return compact('entrance_id');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEntranceRequest $request, Entrance $entrance)
    {
        $data = $request->validated();
        DB::transaction(function() use ($data, $entrance) {
            $entrance->update($data);
            if(isset($data['intercoms']))
                $entrance->hasManySync(EntranceIntercom::class, $data['intercoms'], 'intercoms');
        });
        return new EntranceResource($entrance);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Entrance $entrance)
    {
        $client_ids = $entrance->clients()->pluck('id')->toArray();
        $null_entrance = Entrance::where('address_id', $entrance->address_id)->whereNull('entrance')->first('id');
        if(!$null_entrance)
            $null_entrance = Entrance::create(['address_id' => $entrance->address_id, 'entrance' => null]);

        Client::whereIn('id', $client_ids)->update(['entrance_id' => $null_entrance->id]);
        $entrance->delete();
    }
}
