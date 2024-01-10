<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\AddressResource;
use App\Models\Address;
use Illuminate\Http\Request;

class AddressesController extends Controller
{
    public function search(Request $request) {
        $page = $request->exists('page')?intval($request->get('page')):1;
        $limit = $request->exists('limit')?intval($request->get('limit')):-1;
        $pagination = !$request->exists('pagination') || $request->get('pagination') == 'true';
        $word = str_replace(' ', '', $request->get('word'));

        $query = Address::query();
        $query->whereRaw("REPLACE(CONCAT(city,street,house,entrance), ' ', '') LIKE '%".$word."%'");

        if($limit == -1)
            $result = $query->get();
        else {
            if($pagination)
                $result = $query->paginate($limit, ['*'], '', $page);
            else
                $result = $query->limit($limit)->get();
        }

        return AddressResource::collection($result);
    }
}
