<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\AddressIndexResource;
use App\Http\Resources\AddressResource;
use App\Models\Address;
use App\Traits\GetResult;
use App\Traits\ParseResourceRequest;
use Illuminate\Http\Request;

class AddressesController extends Controller
{
    use GetResult;
    use ParseResourceRequest;

    public function search(Request $request) {
        [$page, $limit, $pagination] = $this->parseResourceRequest($request);
        $word = str_replace(' ', '', $request->get('word'));

        $query = Address::query();
        $query->whereRaw("REPLACE(CONCAT(city,street,house), ' ', '') LIKE '%".$word."%'")->orderByRaw('house+0');

        if($request->exists('filter'))
            foreach($request->get('filter') as $key => $value)
                $query->where($key, $value);

        return AddressResource::collection($this->getResult($query, $limit, $page, $pagination));
    }
    public function getCities() {
        return Address::select('city')->groupBy('city')->get();
    }

    public function index(Request $request) {
        [$page, $limit, $pagination] = $this->parseResourceRequest($request);

        $query = Address::query();

        if($request->exists('filter'))
            foreach($request->get('filter') as $key => $value)
                $query->where($key, $value);

        return AddressIndexResource::collection($this->getResult($query, $limit, $page, $pagination));
    }

    public function indexWorker(Request $request) {
        $query = Address::whereNull('worker_id');
        if($request->exists('worker_id'))
            $query->orWhere('worker_id', $request->get('worker_id'));

        return AddressResource::collection($query->get());
    }

    public function show(Address $address) {
        return new AddressResource($address);
    }
}
