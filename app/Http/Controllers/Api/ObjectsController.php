<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateObjectRequest;
use App\Http\Requests\UpdateObjectRequest;
use App\Http\Resources\ObjectResource;
use App\Models\Address;
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
        $data = $request->validated();
        $object = DB::transaction(function() use ($request, $address, $data) {
            $object = new Objects($data);
            $object->objectable()->associate($address);
            $object->save();
            $object->hasManySync(ObjectCamera::class, $data['cameras'], 'cameras');
            $object->hasManySync(ObjectNet::class, $data['nets'], 'nets');
            return $object;
        });

        return new ObjectResource($object);
    }

    public function updateAddress(UpdateObjectRequest $request, Address $address) {
        $data = $request->validated();
        $object = $address->object;
        DB::transaction(function() use ($request, $address, $data, $object) {
            $object->update($data);
            $object->objectable()->associate($address);
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
}
