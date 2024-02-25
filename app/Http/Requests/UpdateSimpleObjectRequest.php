<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSimpleObjectRequest extends FormRequest
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
        $object_rules = UpdateObjectRequest::getRules($this->get('object')['id']);
        $object_rules_array = [];
        foreach($object_rules as $key => $object_rule)
            $object_rules_array['object.'.$key] = $object_rule;

        return [
            'name' => [
                Rule::unique('simple_objects', 'name')->where('city', $this->input('city'))->ignore($this->get('id')),
            ],
            'type' => 'required',
            'city' => 'required',
            'house' => '',
            'street' => '',
            ...$object_rules_array,
        ];
    }
}
