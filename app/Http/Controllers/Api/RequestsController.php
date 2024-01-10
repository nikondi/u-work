<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\RequestStoreRequest;
use App\Http\Resources\RequestProtectedResource;
use App\Http\Resources\RequestResource;
use App\Models\Client;
use App\Models\Request as RequestModel;
use Illuminate\Http\Request;

class RequestsController extends Controller
{
    public function store(RequestStoreRequest $request) {
        $data = $request->validated();
        if(isset($data['status']))
            $data['status'] = RequestModel::convertStatusLabel($data['status']);

        $item = RequestModel::create($data);

        if($request->user()->hasRole('tomoru'))
            return response(new RequestProtectedResource($item), 200);
        else
            return response(new RequestResource($item), 200);
    }
    public function index(Request $request) {
        $page = $request->exists('page')?intval($request->get('page')):1;
        $limit = $request->exists('limit')?intval($request->get('limit')):-1;

        $query = RequestModel::query();

        if($request->exists('order')) {
            foreach($request->get('order') as $orderKey => $direction)
                $query->orderBy($orderKey, $direction);
        }

        if($request->exists('filter')) {
            foreach($request->get('filter') as $column => $value) {
                if($column == 'status')
                    $value = RequestModel::convertStatusLabel($value);

                if(is_array($value))
                    $query->where($column, $value[0], $value[1]);
                else
                    $query->where($column, $value);
            }
        }

        if($limit != -1)
            $results = $query->paginate($limit, ['*'], '', $page);
        else
            $results = $query->get();

        return RequestResource::collection($results);
    }
}
