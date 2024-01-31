<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class RequestCreateEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels, Queueable;

    public array $data;

    public function __construct($data, $type = 'create')
    {
//        $this->queue = 'peer';

        $this->data = ['type' => $type, 'data' => $data];
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('requests')
        ];
    }

    public function broadcastAs()
    {
        return 'create';
    }

    public function broadcastWith()
    {
        return $this->data;
    }
}
