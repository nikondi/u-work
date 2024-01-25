<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\RequestStoreRequest;
use App\Http\Resources\RequestProtectedResource;
use App\Http\Resources\RequestResource;
use App\Models\Address;
use App\Models\Client;
use App\Models\Request as RequestModel;
use Illuminate\Http\Request;

class RequestsController extends Controller
{
    public function store(RequestStoreRequest $request) {
        $data = $request->validated();
        if(isset($data['status']))
            $data['status'] = RequestModel::convertStatusLabel($data['status']);

        if(!empty($data['address_id'])) {
            $address = Address::find($data['address_id']);
            if($address && $address->worker)
                $data['worker_id'] = $address->worker->id;
        }
        if(!empty($data['client_id'])) {
            $client = Client::find($data['client_id']);
            if($client) {
                $data['address_id'] = $client->address->id;
                if($client->address->worker)
                    $data['worker_id'] = $client->address->worker->id;
            }
        }

        $item = null;
        if($request->user()->hasRole('tomoru')) {
            $data['source'] = empty($data['source'])?'tomoru':$data['source'];
            $data['type'] = empty($data['type'])?'call':$data['type'];
            $data['subject'] = empty($data['subject'])?($data['client_phone'].' - Входящий звонок'):$data['subject'];

            if(!isset($data['client_id'])) {
                $temp_request = RequestModel::where(['client_phone' => $data['client_phone'], 'temp' => true])->first();
                if($temp_request) {
                    $temp_request->update($data);
                    $temp_request->save();
                    $item = $temp_request;
                    RequestModel::where(['client_phone' => $data['client_phone'], 'temp' => true])->whereNot('id', $temp_request->id)->delete();
                }
            }
        }

        if(is_null($item))
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
            foreach($request->get('order') as $orderKey => $direction) {
                if($orderKey == 'status') {
                    $order = RequestModel::getStatusOrder();
                    $query->orderByRaw('FIELD(status'.str_repeat(', ?', sizeof($order)).') '.$direction, $order);
                }
                else
                    $query->orderBy($orderKey, $direction);
            }
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

        if($request->user()->hasRole('worker')) {
            $query->whereWorkerId($request->user()->id);
            $query->orWhereNull('worker_id');
        }

        if($limit != -1)
            $results = $query->paginate($limit, ['*'], '', $page);
        else
            $results = $query->get();

        return RequestResource::collection($results);
    }

    public function update(Request $req, RequestModel $request) {
        $data = $req->toArray();
        if(isset($data['status']) && preg_replace('/\d/', '', $data['status']) != '')
            $data['status'] = RequestModel::convertStatusLabel($data['status']);

        $request->update($data);
        return new RequestResource($request);
    }

    public function updateOrder(Request $request) {
        foreach($request->toArray() as $item)
            RequestModel::find($item['id'])->update(['order'=> $item['index']]);
        return true;
    }
}
