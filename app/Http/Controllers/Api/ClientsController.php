<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\UpdateClientRequest;
use App\Http\Resources\ClientResource;
use App\Models\Client;
use App\Models\Request as RequestModel;
use Illuminate\Http\Request;

class ClientsController extends Controller
{
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
        $page = $request->exists('page')?intval($request->get('page')):1;
        $limit = $request->exists('limit')?intval($request->get('limit')):-1;
        $pagination = !$request->exists('pagination') || $request->get('pagination') == 'true';

        $query = Client::query();
        $columns = ['id', 'phone', 'name', 'comment'];
        foreach($columns as $column)
            $query->orWhere($column, 'LIKE', '%'.$request->get('word').'%');

        if($limit == -1)
            $result = $query->get();
        else {
            if($pagination)
                $result = $query->paginate($limit, ['*'], '', $page);
            else
                $result = $query->limit($limit)->get();
        }

        return ClientResource::collection($result);
    }

    public function index(Request $request) {
        $page = $request->exists('page')?intval($request->get('page')):1;
        $limit = $request->exists('limit')?intval($request->get('limit')):-1;

        if($limit == -1)
            return ClientResource::collection(Client::all());
        else
            return ClientResource::collection(Client::paginate($limit, ['*'], '', $page));
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
}
