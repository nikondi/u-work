<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateObjectRequest extends FormRequest
{
    static public function getRules($id): array {
        return [
            'type' => 'required',
            'router' => '',
            'internet' => '',
            'worker' => 'array|nullable',
            'nets' => 'array|nullable',
            'nets.*.subnet' => 'required',
            'nets.*.wan' => 'required_unless:net.*.subnet,null',
            'nets.*.pppoe_cred' => 'required_unless:net.*.subnet,null',
            'cameras' => 'array|nullable',
            'cameras.*.ip' => '',
            'cameras.*.model' => '',
            'sip' => 'nullable|numeric|min:111|max:999999|unique:objects,sip,'.$id,
            'cubic_ip' => '',
            'minipc_model' => '',
            'intercom_model' => '',
            'comment' => '',
            'files' => 'array|nullable',
            'files.*.id' => 'nullable',
            'files.*.title' => 'nullable',
            'files.*.url' => 'nullable',
            'files.*.type' => 'string|nullable',
            'files.*.basename' => 'string|nullable',
            'files.*.file' => 'file|nullable',
            'files.*.path' => 'string|nullable',
        ];
    }
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
        return static::getRules($this->get('id'));
    }

    protected function prepareForValidation(): void
    {
        $data = $this->toArray();
        if(isset($data['object']))
            $this->replace($data['object']);
        if(in_array($data['internet'], ['true', 'false']))
            $this->merge(['internet' => $data['internet'] == 'true']);

    }
}
