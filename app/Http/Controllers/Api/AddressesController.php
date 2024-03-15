<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\AddressIndexResource;
use App\Http\Resources\AddressResource;
use App\Http\Resources\ClientEntranceResource;
use App\Models\Address;
use App\Models\Client;
use App\Models\Entrance;
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

    public function getClients(int $address_id) {
        $entrances = Entrance::where('address_id', $address_id)->orderBy('entrance')->pluck('id')->toArray();
        return ClientEntranceResource::collection(Client::whereIn('entrance_id', $entrances)->orderByRaw('cast(apartment as unsigned)')->with('entrance')->get());
    }
    public function saveClients(Request $request, int $address_id) {
        $clients = $request->get('clients');
        foreach($clients as $client)
            Client::where('id', $client['client_id'])->update(['entrance_id' => $client['entrance_id']]);

        Entrance::where('address_id', $address_id)->whereNull('entrance')->whereDoesntHave('clients')->delete();
        return true;
    }
}
