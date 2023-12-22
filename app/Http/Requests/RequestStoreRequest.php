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
        return auth()->user()->hasRole('tomoru', 'manager');
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
            'client_name' => 'string|nullable',
            'client_phone' => 'required',
            'client_phone_contact' => 'nullable',
            'address_id' => 'integer|nullable',
            'address' => 'string|nullable',
            'content' => 'string|nullable',
        ];
    }
}
