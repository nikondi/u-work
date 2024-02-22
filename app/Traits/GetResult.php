<?php

namespace App\Traits;

trait GetResult {
    private function getResult($query, $limit, $page, $pagination) {
        if($limit == -1)
            return $query->get();
        else {
            if($pagination)
                return $query->paginate($limit, ['*'], '', $page);
            else
                return $query->limit($limit)->get();
        }
    }
}
