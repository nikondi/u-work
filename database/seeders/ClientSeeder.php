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

        $filePath = Storage::disk('public')->path('Контрагенты.csv');

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
        $map = ['id', 'type', 'name', 'city', 'street', 'house', 'apartment', 'floor', 'entrance', 'district', 'phone', 'phone_second', 'intercom', 'contract', 'status', 'skud', 'tv', 'kalitka', 'video', 'payment', 'blocked_by_payment', 'hand_blocking', 'object', 'zone', 'uk', 'comment'];
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

            $line_arr['phone'] = str_replace([',,', ','], ';', $line_arr['phone']);
            $line_arr['phone_second'] = str_replace([',,', ','], ';', $line_arr['phone_second']);

            $line_arr['phone'] = implode(',', array_filter(array_map(function($value) {
                $value = trim(preg_replace('/[^0-9]/', '', $value));
                if(strlen($value) == 10 && str_starts_with($value, '9'))
                    $value = '8'.$value;
                if(str_starts_with($value, '98'))
                    $value = '89'.substr($value, 2);
                return $value;
            }, [...explode(';', $line_arr['phone']), ...explode(';', $line_arr['phone_second'])])));
            if(empty($line_arr['phone']))
                $line_arr['phone'] = null;


            $line_arr['name'] = trim(preg_replace('/[0-9\-]/', '', $line_arr['name']));
            $line_arr['name'] = str_replace('  ', ' ', $line_arr['name']);
            if(empty($line_arr['name']))
                $line_arr['name'] = null;
            $line_arr['name'] = match ($line_arr['name']) {
                'Ф.И.О.', 'Фио ..', 'Фамилия И.О.', 'ФИО', '..', 'Ф.И.О ..' => null,
                default => $line_arr['name']
            };

            $line_arr['status'] = match ($line_arr['status']) {
                'Действующий' => Client::STATUS_ACTIVE,
                'Отказался' => Client::STATUS_REJECT,
                'Первичный контакт' => Client::STATUS_FIRST_CONTACT,
                'Нет договора' => Client::STATUS_INVALID,
                default => Client::STATUS_UNKNOWN,
            };

            if(empty($line_arr['entrance']))
                $line_arr['entrance'] = null;

            $line_arr['street'] = str_replace('ул. ', 'ул.', $line_arr['street']);
            $line_arr['street'] = str_replace('мкр. ', 'мкр.', $line_arr['street']);
            $line_arr['street'] = str_replace('пер. ', 'пер.', $line_arr['street']);
            $line_arr['street'] = str_replace(['  ', '   '], '', $line_arr['street']);
            $line_arr['city'] = str_replace(['г. ', 'Г. ', 'Г.'], 'г.', $line_arr['city']);

            $line_arr['city'] = match ($line_arr['city']) {
                'г.ЛИПЕЦК', 'г..Липецк', 'г.Дипецк', 'г.Липеук', 'г.Липец', 'г.Липеце', 'г.Липецка', 'г.Липецке', 'г.Липпецк', 'г.Лмипецк', 'гор. Липецк', 'гюЛипецк', 'Липецк', 'Липецк г', 'Липцк' => 'г.Липецк',
                'г.Лебелянь' => 'г.Лебедянь',
                'Елец' => 'г.Елец',

                default => $line_arr['city']
            };

            $line_arr['street'] = match ($line_arr['street']) {
                'УЛ.ЗАМЯТИНА Е.И.', 'Замятина Е.И. ул' => 'ул.Замятина',
                'Елецкое шоссе', 'Елецкое ш', 'Елецкое ш.', 'ул.Шоссе Елецкое', 'ул.шоссе Елецкое', 'ул.Лебедянское ш.' => 'шоссе Елецкое',
                'ул.Лебедянское шоссе', 'Лебедянское ш.', 'Лебедянское шоссе', 'ул.Шоссе Лебедянское' => 'шоссе Лебедянское',
                'С.Казьмина', 'ул.С. Казьмина', 'ул.С.Казьмина', 'ул.Казьмина' => 'ул.Сергея Казьмина',
                'Шевченко' => 'ул.Шевченко',
                'Хренникова Т.', 'УЛ.ХРЕННИКОВА', 'ул.Т.Хренникова', 'ул.Хренникова Т.', 'ул Хренникова' => 'ул.Хренникова',
                'ул.Осоавиахиа' => 'ул.Осоавиахима',
                'ул.Н. Логовая' => 'ул.Нижняя Логовая',
                'ул.Мистюкова' => 'ул.Мистюкова А.П.',
                'Гагарина' => 'ул.Гагарина',
                'Игнатьева' => 'ул.Игнатьева',
                'Качалова' => 'ул.Качалова',
                'Артемова', 'у.Артемова' => 'ул.Артемова',
                'Бачурина' => 'ул.Бачурина',
                'Александровский', 'ул.мкр Александровский', 'мкр Александровский', 'Александровский мкр.' => 'мкр.Александровский',
                'Боевой проезд', 'Боевой пр-д', 'пр-д Боевой', 'пр. Боевой', 'ул.пр.Боевой', 'ул.Боевой проезд' => 'проезд Боевой',
                'ул Неделина', 'Неделина', 'ул, Неделина', 'ул.Недалина' => 'ул.Неделина',
                'ул.Бехтееева', 'УЛ. БЕХТЕЕВА', 'ул.Ьехтеева', 'улБехтеева', 'ул .Бехтеева', 'ул. Бехтеева', 'Бехтеева ул' => 'ул.Бехтеева',
                'ул.50 лет  НЛМК' => 'ул.50 лет НЛМК',
                'Свиридова', 'УЛ. СВИРИДОВА', 'Ул. Свиридова', 'ул.Свиридова И.В.', 'уд.Свиридова', 'УЛ. СВИРИДОВА', 'ул Свиридова' => 'ул.Свиридова',
                'просп.60 лет СССР' => 'проспект 60 лет СССР',
                'уд.Ударников' => 'ул.Ударников',
                'Зегеля' => 'ул.Зегеля',
                'Катукова', 'ул Катукова' => 'ул.Катукова',
                'Осканова', 'ул.Рсканова' => 'ул.Осканова',
                'Кузнечная' => 'ул.Кузнечная',
                'ул Доватора' => 'ул.Доватора',
                'Кривенкова' => 'ул.Кривенкова',
                'Архангельская' => 'ул.Архангельская',
                'Мистюкова', 'ул.Мистюкова А.П.' => 'ул.Мистюкова',
                'Лутова' => 'ул.Лутова',
                'Московская', 'ул.Московсская' => 'ул.Московская',
                'Пионерская' => 'ул.Пионерская',
                '8 марта' => 'ул.8 марта',
                'Опытная', 'ул Опытная' => 'ул.Опытная',
                'Скороходова' => 'ул.Скороходова',
                'Смородина', 'ул.Смородина П.', 'ул.Смородина Петра', 'ул.П. Смородина', 'ул.П.Смородина', 'ул.Смородина' => 'ул.Петра Смородина',
                'Стаханова', 'у.Стаханова' => 'ул.Стаханова',
                'Хорошавина' => 'ул.Хорошавина',
                'Угловая' => 'ул.Угловая',
                'ул.Привкзальная', 'ул Привокзальная' => 'ул.Привокзальная',
                'М.Расковой' => 'ул.М.Расковой',
                'Балмочных', 'Балмочных С.Ф. ул' => 'ул.Балмочных',
                'Белянского А.Д.', 'Белянского ул' => 'ул.Белянского',
                'Бехтеева', 'Бехтеева ул', 'ул .Бехтеева', 'ул Бехтеева', 'увл.Бехтеева', 'ул. Бехтеева' => 'Бехтеева ул',
                'б-р Шубина', 'бул.Шубина' => 'бульвар Шубина',
                'Большая Дорогомиловская' => 'ул.Большая Дорогомиловская',
                'пр-т Мира', 'пр.Мира', 'просп.Мира', 'пр. Мира', 'ул.проспект Мира' => 'проспект Мира',
                'ул.Проспект Победы', 'пр-т Победы', 'пр-т. Победы', 'пр-т.Победы', 'пр. Победы', 'пр.Победы', 'просп.Победы', 'пр.т Победы', 'ул.проспект Победы', 'ул.просп.Победы', 'ул.пр.Победы' => 'проспект Победы',
                'пл. Победы' => 'пл.Победы',
                'ул.проезд Сиреневый', 'ул.пр.Сиреневый' => 'проезд Сиреневый',
                'просп. 60 лет СССР', 'пр. 60 лет СССР' => 'проспект 60 лет СССР',
                'Политехническая ул' => 'ул.Политехническая',
                'С.Л.Коцаря', 'ул.С.Коцаря', 'ул.Коцаря C.Л.', 'ул.Коцаря С.Л.', 'ул.Коцаря', 'Коцаря С.Л.', 'ул Коцаря' => 'ул.С.Л.Коцаря',
                'ул.Шерстобитова С.М.' => 'ул.Шерстобитова',
                'Б.Хмельницкого' => 'ул.Хмельницкого',
                'ул. Ангарская' => 'ул.Ангарская',
                'ул.Мистюкова' => 'ул.Мистюкова А.П.',
                'ул.В. Музики', 'ул.В.Музыки', 'ул.Виктора Музыки' => 'ул.В. Музыки',
                'ул.Героя России Эдуарда Белана' => 'ул.Белана',
                'ул. Коммунальная' => 'ул.Коммунальная',
                '15', '15 микрорайон', 'ул.15 микрорайон', 'ул.15 мк-н', 'ул.15 мкр', 'ул.15м-н' => '15 мкр.',
                '9 микрорайон' => '9 мкр.',
                'В.Огнева', 'ул.Огнева Вилли', 'ул.Огнева' => 'ул.В. Огнева',
                'ул.Агронамическая' => 'ул.Агрономическая',

                default => $line_arr['street']
            };

            if(str_contains($line_arr['street'], 'п.Агроном, ')) {
                $line_arr['city'] = 'п.Агроном';
                $line_arr['street'] = substr($line_arr['street'], strlen('п.Агроном, '));
            }
            if(str_contains($line_arr['street'], 'п.Краснинский, ')) {
                $line_arr['city'] = 'п.Краснинский';
                $line_arr['street'] = substr($line_arr['street'], strlen('п.Краснинский, '));
            }
            if(str_contains($line_arr['street'], 'г.Грязи, ')) {
                $line_arr['city'] = 'г.Грязи';
                $line_arr['street'] = substr($line_arr['street'], strlen('г.Грязи, '));
            }

            if($line_arr['street'] == '?')
                $line_arr['street'] = 'unknown';
            if($line_arr['house'] == '?')
                $line_arr['house'] = 'unknown';

            $line_arr['house'] = mb_strtolower(str_replace(['"', ' '], '', $line_arr['house']));

            $line_arr['city'] = empty($line_arr['city'])?'unknown':$line_arr['city'];
            $line_arr['street'] = empty($line_arr['street'])?'unknown':$line_arr['street'];
            $line_arr['house'] = empty($line_arr['house'])?'unknown':$line_arr['house'];

            $client = Client::updateOrCreate(['id' => $line_arr['id']], $line_arr);

            if($line_arr['city'] != 'unknown' || $line_arr['street'] != 'unknown' || $line_arr['house'] != 'unknown') {
                $address = Address::firstOrCreate([
                    'city' => $line_arr['city'],
                    'street' => $line_arr['street'],
                    'house' => $line_arr['house'],
                    'entrance' => $line_arr['entrance'],
                ], $line_arr);
                $client->address()->associate($address)->save();
            }


            $this->command->getOutput()->progressAdvance();
        }
        $this->command->getOutput()->progressFinish();

        fclose($csv);
    }
}
