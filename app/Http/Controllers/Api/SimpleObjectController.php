<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateSimpleObjectRequest;
use App\Http\Requests\UpdateSimpleObjectRequest;
use App\Http\Resources\SimpleObjectResource;
use App\Models\ObjectCamera;
use App\Models\ObjectNet;
use App\Models\Objects;
use App\Models\SimpleObject;
use App\Traits\GetResult;
use App\Traits\ParseResourceRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response as ResponseCodes;

class SimpleObjectController extends Controller
{
    use GetResult;
    use ParseResourceRequest;

    public function search(Request $request) {
        [$page, $limit, $pagination] = $this->parseResourceRequest($request);
        $word = str_replace(' ', '', $request->get('word'));

        $query = SimpleObject::query();
        $query->whereRaw("REPLACE(CONCAT(city,street,house), ' ', '') LIKE '%".$word."%'")->orderByRaw('house+0');

        if($request->exists('filter'))
            foreach($request->get('filter') as $key => $value)
                $query->where($key, $value);

        return SimpleObjectResource::collection($this->getResult($query, $limit, $page, $pagination));
    }

    public function index(Request $request) {
        [$page, $limit, $pagination] = $this->parseResourceRequest($request);

        $query = SimpleObject::query();

        if($request->exists('filter'))
            foreach($request->get('filter') as $key => $value)
                $query->where($key, $value);

        return SimpleObjectResource::collection($this->getResult($query, $limit, $page, $pagination));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateSimpleObjectRequest $request)
    {
        $data = $request->validated();

        $simpleObject = DB::transaction(function() use ($data) {
            $simpleObject = SimpleObject::create($data);

            $object = new Objects($data);
            $object->objectable()->associate($simpleObject);
            $object->save();
            $object->hasManySync(ObjectCamera::class, $data['object']['cameras'], 'cameras');
            $object->hasManySync(ObjectNet::class, $data['object']['nets'], 'nets');
            $simpleObject->object = $object;
            return $simpleObject;
        });

        if($simpleObject == null)
            abort(ResponseCodes::HTTP_INTERNAL_SERVER_ERROR, 'Объект не создался');
        else
            return new SimpleObjectResource($simpleObject);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): SimpleObjectResource
    {
        $simpleObject = SimpleObject::with('object')->findOrFail($id);
        return new SimpleObjectResource($simpleObject);
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
    public function update(UpdateSimpleObjectRequest $request, string $id)
    {
        $data = $request->validated();
        $simpleObject = DB::transaction(function() use ($data, $id) {
            $simpleObject = SimpleObject::with('object')->findOrFail($id);
            $simpleObject->update($data);
            $simpleObject->object->update($data['object']);
            $simpleObject->object->hasManySync(ObjectCamera::class, $data['object']['cameras'], 'cameras');
            $simpleObject->object->hasManySync(ObjectNet::class, $data['object']['nets'], 'nets');
            return $simpleObject;
        });
        return new SimpleObjectResource($simpleObject);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $simpleObject = SimpleObject::with('object')->findOrFail($id);
        $simpleObject->delete();
        return true;
    }
}
