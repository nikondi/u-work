<?php

namespace App\Http\Controllers;

use App\Http\Requests\RequestStoreRequest;
use App\Http\Resources\RequestProtectedResource;
use App\Models\Request;

class RequestsController extends Controller
{
    public function store(RequestStoreRequest $request) {
        $item = Request::create($request->validated());
        return response(new RequestProtectedResource($item), 200);
    }
}
