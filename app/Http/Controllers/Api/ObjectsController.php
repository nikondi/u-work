<?php

namespace App\Http\Controllers\Api;

use App\API\ARI;
use App\Http\Controllers\Controller;
use App\Http\Requests\CreateObjectRequest;
use App\Http\Requests\UpdateObjectRequest;
use App\Http\Resources\ObjectResource;
use App\Models\Address;
use App\Models\Entrance;
use App\Models\ObjectCamera;
use App\Models\ObjectNet;
use App\Models\Objects;
use App\Models\SimpleObject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ObjectsController extends Controller
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
    public function store(CreateObjectRequest $request)
    {
        abort(500, 'Not inited method');
    }

    public function storeAddress(CreateObjectRequest $request, Address $address) {
        return $this->storeMorphed($request, $address);
    }
    public function updateAddress(UpdateObjectRequest $request, Address $address) {
        return $this->updateMorphed($request, $address);
    }
    public function storeEntrance(CreateObjectRequest $request, Entrance $entrance) {
        return $this->storeMorphed($request, $entrance);
    }
    public function updateEntrance(UpdateObjectRequest $request, Entrance $entrance) {
        return $this->updateMorphed($request, $entrance);
    }

    public function storeMorphed(CreateObjectRequest $request, Entrance|Address $item) {
        $data = $request->validated();
        $object = DB::transaction(function() use ($request, $item, $data) {
            $object = new Objects($data);
            $object->objectable()->associate($item);
            $object->save();
            $object->hasManySync(ObjectCamera::class, $data['cameras'], 'cameras');
            $object->hasManySync(ObjectNet::class, $data['nets'], 'nets');
            return $object;
        });

        return new ObjectResource($object);
    }

    public function updateMorphed(UpdateObjectRequest $request, Entrance|Address $item) {
        $data = $request->validated();
        $object = $item->object;
        DB::transaction(function() use ($request, $item, $data, $object) {
            $object->update($data);
            $object->objectable()->associate($item);
            $object->save();
            $object->hasManySync(ObjectCamera::class, $data['cameras'], 'cameras');
            $object->hasManySync(ObjectNet::class, $data['nets'], 'nets');
            return $object;
        });

        return new ObjectResource($object);
    }


    /**
     * Display the specified resource.
     */
    public function show(Objects $object)
    {
        return new ObjectResource($object->with('nets')->with('cameras'));
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
    public function update(UpdateObjectRequest $request, string $id)
    {
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }


    public function updateStatuses() {
        $ARI = new ARI();
        $peers = $ARI->getPeers();
        $time = now()->format('Y-m-d H:i:s');
        foreach($peers as $peer) {
            $object = ['status' => $peer['state']];
            if($peer['state'] == 'online')
                $object['last_online'] = $time;
            if($obj = Objects::where('sip', $peer['sip'])->first())
                $obj->update($object);
        }
    }
}
