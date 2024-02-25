<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\UpdateClientRequest;
use App\Http\Resources\ClientResource;
use App\Models\Client;
use App\Models\Request as RequestModel;
use App\Traits\GetResult;
use App\Traits\ParseResourceRequest;
use Illuminate\Http\Request;

class ClientsController extends Controller
{
    use GetResult;
    use ParseResourceRequest;

    public function search(Request $request) {
        if(!$request->exists('phone') && !$request->exists('id'))
            return response(['error' => 'Expected phone or ID of client', 'errorCode' => 101], 400);

        $client = null;
        if($request->exists('id'))
            $client = Client::find($request->get('id'));
        else if($request->exists('phone'))
            $client = Client::whereRaw('FIND_IN_SET("'.$request->get('phone').'", phone)')->first();

        if($client === null)
            return response(['error' => 'Client not found', 'errorCode' => 104], 404);

        if($request->user()->hasRole('tomoru')) {
            RequestModel::where(['client_phone' => $request->get('client_phone'), 'temp' => true])->delete();
            RequestModel::create([
                'client_phone' => $request->get('client_phone'),
                'client_id' => $request->get('id'),
                'temp' => true
            ]);
        }

        return response(new ClientResource($client), 200);
    }

    public function searchAny(Request $request) {
        [$page, $limit, $pagination] = $this->parseResourceRequest($request);

        $query = Client::query();
        $columns = ['id', 'phone', 'name', 'comment'];
        foreach($columns as $column)
            $query->orWhere($column, 'LIKE', '%'.$request->get('word').'%');

        return ClientResource::collection($this->getResult($query, $limit, $page, $pagination));
    }

    public function index(Request $request) {
        [$page, $limit, $pagination] = $this->parseResourceRequest($request);

        $query = Client::query();

        if($request->exists('filter'))
            $this->filterRequest($query, $request->get('filter'));

        return ClientResource::collection($this->getResult($query, $limit, $page, $pagination));
    }

    public function store(StoreClientRequest $data) {
        $client = Client::create($data->validated());
        return new ClientResource($client);
    }
    public function show(Client $client) {
        return new ClientResource($client);
    }
    public function update(UpdateClientRequest $request, Client $client) {
        $client->update($request->validated());
        $client->save();
        return new ClientResource($client);
    }

    private function filterRequest($query, $filter) {
        foreach($filter as $key => $value)
            $query->where($key, $value);
    }
}
