<?php

use App\Services\PageService;

if (! function_exists('page')) {
    function page(): PageService
    {
        return app('page');
    }
}
