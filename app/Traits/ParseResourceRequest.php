<?php

namespace App\Traits;

use Illuminate\Http\Request;

trait ParseResourceRequest {
    /**
     * Returns [page, limit, pagination] variables
     *
     * @param Request $request
     * @return array
     */
    private function parseResourceRequest(Request $request): array
    {
        $page = $request->exists('page')?intval($request->get('page')):1;
        $limit = $request->exists('limit')?intval($request->get('limit')):-1;
        $pagination = !$request->exists('pagination') || $request->get('pagination') == 'true';

        return [$page, $limit, $pagination];
    }
}
