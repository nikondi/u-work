<?php
namespace App\Helpers;

class ErrorsHelper
{
    public static function throw($exception) {
        report($exception);
        throw $exception;
    }
}
