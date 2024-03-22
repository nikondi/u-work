<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEntranceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'intercoms' => 'array|nullable',
            'intercoms.*.id' => 'nullable',
            'intercoms.*.model' => 'required',
            'intercoms.*.version' => 'string|nullable',
            'intercoms.*.calling_panel' => 'string|nullable',
            'intercoms.*.door_type' => 'string|nullable',
            'entrance' => 'numeric|nullable',
            'per_floor' => 'numeric|nullable',
        ];
    }
}
