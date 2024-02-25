<?php

namespace App\Traits;

trait HasManySync {
    public function hasManySync($model, $items, $relation, $foreign_key = null): void
    {
        if($foreign_key == null)
            $foreign_key = $this->getTable().'_id';

        $children = $this->$relation;
        $cameras = collect($items);
        $deleted_ids = $children->filter(function ($child) use ($cameras) {
            return empty($cameras->where('id', $child->id)->first());
        })->map(function ($child) {
            $id = $child->id;
            $child->delete();
            return $id;
        });
        $attachments = $cameras->filter(function($answerOption) {
            // Old entry (you can add your custom code here)
            return empty($answerOption['id']);
        })->map(function ($answerOption) use ($foreign_key, $model, $deleted_ids) {
            // New entry (you can add your custom code here)
            $answerOption['id'] = $deleted_ids->pop();
            return new $model([...$answerOption, $foreign_key => $this->id]);
        });
        $this->$relation()->saveMany($attachments);
    }
}
