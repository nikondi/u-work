<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Validation\ValidationException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->renderable(function(AuthenticationException $e, $request) {
            if($request->is('api/*')) {
                return response()->json([
                    'error' => 'Unauthenticated.',
                    'errorCode' => 1,
                ], 401);
            }

            return null;
        });

        $this->renderable(function (ValidationException $exception, $request) {
            if (!$request->wantsJson() || !$request->user()->hasRole('tomoru'))
                return null; // Laravel handles as usual

            throw ApiValidationException::withMessages(
                $exception->validator->getMessageBag()->getMessages()
            );

        });

        $this->reportable(function (Throwable $e) {
            //
        });
    }
}
