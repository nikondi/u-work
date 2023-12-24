<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Request>
 */
class RequestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'client_name' => $this->faker->name(),
            'client_phone' => preg_replace('/\D/', '', $this->faker->phoneNumber()),
            'client_phone_contact' => (rand(0,1) == 1)?preg_replace('/\D/', '', $this->faker->phoneNumber()):null,
            'address' => $this->faker->address(),
            'content' => $this->faker->text(500),
            'status' => $this->faker->numberBetween(-1, 2),
        ];
    }
}
