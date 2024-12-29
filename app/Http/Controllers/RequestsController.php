<?php

namespace App\Http\Controllers;

use App\Http\Requests\RequestSaveRequest;
use App\Models\Request as RequestModel;

class RequestsController extends Controller
{
    public function update(RequestSaveRequest $saveRequest, RequestModel $request) {
        $data = $saveRequest->validated();
        $request->update($data);

        return back();
    }}
