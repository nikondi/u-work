<?php

namespace App\Http\Controllers;

use App\Http\Resources\RequestResource;
use App\Models\Request as RequestModel;

class KanbanController extends Controller
{
    public function index()
    {
        return page()
            ->title('Канбан')
            ->render('Kanban/Index', []);
    }

    public function show(RequestModel $request) {
        return page()
            ->title($request->subject ?? 'Заявка #'.$request->id)
            ->render('Kanban/Index', [
                'request' => new RequestResource($request),
            ]);
    }
}
