<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Monolog\Formatter\LineFormatter;
use Monolog\Handler\StreamHandler;
use Monolog\Logger;
use Illuminate\Support\Str;

class ApiRequestLogging
{
    /** @var Logger * */
    private Logger $logger;

    public function __construct()
    {
        $this->logger = $this->getLogger();
    }

    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next): mixed
    {
        $this->logger->info('Incoming request:');
        $formatted_request = clone $request;

        $formatted_request->headers->remove('cookie');
        $formatted_request->headers->remove('x-xsrf-token');

        $this->logger->info('Headers: '.$formatted_request->headers);
        $this->logger->info('Content: '.$formatted_request->getContent());

        return $next($request);
    }

    public function terminate(Request $request, Response|JsonResponse $response): void
    {
        $this->logger->info('Outgoing response:');
        $this->logger->info($response);
    }

    private function getLogger(): Logger
    {
        $dateString = now()->format('m_d_Y');
        $filePath = 'web_hooks/web_hooks_'.$dateString.'.log';
        $dateFormat = "m/d/Y H:i:s";
        $output = "[%datetime%] %channel%.%level_name%: %message%\n";
        $formatter = new LineFormatter($output, $dateFormat);
        $stream = new StreamHandler(storage_path('logs/'.$filePath), Logger::DEBUG);
        $stream->setFormatter($formatter);
        $processId = Str::random(5);
        $logger = new Logger($processId);
        $logger->pushHandler($stream);

        return $logger;
    }
}
