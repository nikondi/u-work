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
        return new ObjectResource(static::storeMorphed($request, $address));
    }
    public function updateAddress(UpdateObjectRequest $request, Address $address) {
        return new ObjectResource(static::updateMorphed($request, $address));
    }
    public function storeEntrance(CreateObjectRequest $request, Entrance $entrance) {
        return new ObjectResource(static::storeMorphed($request, $entrance));
    }
    public function updateEntrance(UpdateObjectRequest $request, Entrance $entrance) {
        return new ObjectResource(static::updateMorphed($request, $entrance));
    }

    public static function storeMorphed(CreateObjectRequest $request, Entrance|Address|SimpleObject $item) {
        $data = $request->validated();
        if(!empty($data['worker']))
            $data['worker_id'] = $data['worker']['id'];
        return DB::transaction(function() use ($request, $item, $data) {
            $object = new Objects($data);
            $object->objectable()->associate($item);
            $object->save();
            if(isset($data['cameras']))
                $object->hasManySync(ObjectCamera::class, $data['cameras'], 'cameras');
            if(isset($data['nets']))
                $object->hasManySync(ObjectNet::class, $data['nets'], 'nets');
            return $object;
        });
    }

    public static function updateMorphed(UpdateObjectRequest $request, Entrance|Address|SimpleObject $item) {
        $data = $request->validated();
        if(!empty($data['worker']))
            $data['worker_id'] = $data['worker']['id'];
        $object = $item->object;
        DB::transaction(function() use ($request, $item, $data, $object) {
            $object->update($data);
            $object->objectable()->associate($item);
            $object->save();
            if(isset($data['cameras']))
                $object->hasManySync(ObjectCamera::class, $data['cameras'], 'cameras');
            if(isset($data['nets']))
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
        return new ObjectResource($object->with('nets')->with('cameras')->with('worker'));
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
