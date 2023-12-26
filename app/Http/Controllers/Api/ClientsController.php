<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\ClientResource;
use App\Models\Client;
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

        return response(new ClientResource($client), 200);
    }

    public function searchAny(Request $request) {
        $page = $request->exists('page')?intval($request->get('page')):1;
        $limit = $request->exists('limit')?intval($request->get('limit')):-1;

        $query = Client::query();
        $columns = ['id', 'phone', 'name', 'comment'];
        foreach($columns as $column)
            $query->orWhere($column, 'LIKE', '%'.$request->get('word').'%');

        if($limit == -1)
            $result = $query->get();
        else
            $result = $query->paginate($limit, ['*'], '', $page);

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

    public function show(Client $client) {
        return new ClientResource($client);
    }
}
