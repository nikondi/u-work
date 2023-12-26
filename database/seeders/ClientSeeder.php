<?php

namespace Database\Seeders;

use App\Models\Address;
use App\Models\Client;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ClientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Model::reguard();

        $filePath = Storage::disk('public')->path('Клиенты.csv');

        $this->command->info('Импорт клиентов');

        if(!file_exists($filePath))
            $this->command->error('Ошибка: файл "'.$filePath.'" не найден');


        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        $this->command->info('Очистка таблицы clients');
        Client::truncate();
        $this->command->info('Очистка таблицы addresses');
        Address::truncate();

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');


        $this->command->getOutput()->progressStart(count(file($filePath)));

        $csv = fopen($filePath, 'r');
        $k = 0;
        $map = ['id', 'city', 'street', 'house', 'entrance', 'apartment', 'floor', 'name', 'phone', 'status', 'comment'];
        while (($line_arr = fgetcsv($csv, 1000, ";")) !== FALSE) {
            if($k++ == 0)
                continue;

            foreach($line_arr as $i => $value) {
                if(isset($map[$i])) {
                    $value = trim(trim($value,'"'));
                    if(empty($value))
                        $value = null;
                    $line_arr[$map[$i]] = $value;
                    unset($line_arr[$i]);
                }
            }
            if(isset($line_arr['type']) && $line_arr['type'] != 'абонент - физ. лицо' || empty(intval($line_arr['id'])))
                continue;

            $line_arr['id'] = intval($line_arr['id']);

            if(empty($line_arr['phone']))
                $line_arr['phone'] = null;

            $line_arr['status'] = match ($line_arr['status']) {
                'Действующий' => Client::STATUS_ACTIVE,
                'Отказался' => Client::STATUS_REJECT,
                'Первичный контакт' => Client::STATUS_FIRST_CONTACT,
                'Нет договора' => Client::STATUS_INVALID,
                default => Client::STATUS_UNKNOWN,
            };

            if(empty($line_arr['entrance']))
                $line_arr['entrance'] = null;

            $line_arr['house'] = mb_strtolower($line_arr['house']);

            $client = Client::updateOrCreate(['id' => $line_arr['id']], $line_arr);

            $address = Address::firstOrCreate([
                'city' => $line_arr['city'],
                'street' => $line_arr['street'],
                'house' => $line_arr['house'],
                'entrance' => $line_arr['entrance'],
            ], $line_arr);
            $client->address()->associate($address)->save();

            $this->command->getOutput()->progressAdvance();
        }
        $this->command->getOutput()->progressFinish();

        fclose($csv);
    }
}
