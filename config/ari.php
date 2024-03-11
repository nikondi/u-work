<?php

return [
    'is_https' => env("ARI_HTTPS", 'false') == 'true',
    'host' => env('ARI_HOST', '127.0.0.1'),
    'app' => env('ARI_APP', 'unidev'),
    'login' => env('ARI_LOGIN', 'test'),
    'password' => env('ARI_PASSWORD', 'test'),
];
