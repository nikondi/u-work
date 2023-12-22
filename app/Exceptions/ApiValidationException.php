<?php

namespace App\Exceptions;

use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;

class ApiValidationException extends ValidationException
{
    public function render($request): JsonResponse
    {
        return new JsonResponse([
            'error' => 'Validation error',
            'errorCode' => 2,
            'description' => $this->validator->errors()->getMessages(),
        ], Response::HTTP_UNPROCESSABLE_ENTITY);
    }
}
