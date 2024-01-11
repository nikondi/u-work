<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RequestStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()->hasRole('tomoru', 'manager', 'admin');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'client_id' => 'integer|nullable',
            'worker_id' => 'integer|nullable',
            'address_id' => 'integer|nullable',
            'client_name' => 'string|nullable|max:90',
            'client_phone' => 'nullable|integer|max_digits:12',
            'client_phone_contact' => 'nullable|integer|max_digits:12',
            'address' => 'string|nullable|max:128',
            'content' => 'string|nullable|max:1024',
            'status' => 'string|nullable',
        ];
    }
}
