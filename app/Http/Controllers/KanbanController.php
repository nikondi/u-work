<?php

namespace App\Http\Controllers;

class KanbanController extends Controller
{
    public function index()
    {
        return page()
            ->title('Канбан')
            ->render('Kanban/Index', []);
    }
}
