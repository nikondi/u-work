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
}
