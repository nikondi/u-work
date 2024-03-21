<?php

namespace App\Traits;

use Illuminate\Support\Collection;

trait HasManySync {
    public function hasManySync($model, $items, $relation, $foreign_key = null, $deleted_callback = null): Collection
    {
        if($foreign_key == null)
            $foreign_key = $this->getTable().'_id';

        $children = $this->$relation;
        $items = collect($items);

        // Удаляем лишние
        $deleted_ids = $children->filter(function ($child) use ($items) {
            return empty($items->where('id', $child->id)->first());
        })->map(function ($child) use ($deleted_callback) {
            if($deleted_callback)
                $deleted_callback($child);

            $id = $child->id;
            $child->delete();
            return $id;
        });

        // Добавляем новые
        $attachments = $items->filter(function($item) {
            // Old entry (you can add your custom code here)
            return empty($item['id']);
        })->map(function ($item) use ($foreign_key, $model, $deleted_ids) {
            // New entry (you can add your custom code here)
            $item['id'] = $deleted_ids->pop();
            return new $model([...$item, $foreign_key => $this->id]);
        });


        $this->$relation()->saveMany($attachments);
        $this->load($relation);

        return $attachments;
    }
}
