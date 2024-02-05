<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateClientRequest extends FormRequest
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
            'id' => 'unique:clients,id,'.$this->id,
            'address_id' => 'exists:addresses,id',
            'phone' => 'nullable',
            'email' => 'email|nullable',
            'status' => 'integer',
            'floor' => 'integer|nullable',
            'apartment' => 'integer|nullable',
            'comment' => 'nullable',
        ];
    }
}
