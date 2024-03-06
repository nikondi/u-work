<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\Exception;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class Request extends Model
{
    use HasFactory;

    const STATUS_UNKNOWN = -1;
    const STATUS_NEW = 0;
    const STATUS_DONE = 1;
    const STATUS_IMPORTANT = 2;

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
    }

    public function addressDB(): BelongsTo
    {
        return $this->belongsTo(Entrance::class, 'address_id', 'id');
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function worker(): BelongsTo
    {
        return $this->belongsTo(User::class, 'worker_id', 'id');
    }

    public function getStatusLabel(): string
    {
        return static::getStatuses($this->status);
    }

    private static function getStatuses($status = null): array|string
    {
        $statuses = [
            static::STATUS_UNKNOWN => 'unknown',
            static::STATUS_NEW => 'new',
            static::STATUS_DONE => 'done',
            static::STATUS_IMPORTANT => 'important',
        ];

        return $statuses[$status] ?? $statuses;
    }

    public static function getStatusOrder(): array
    {
        return [
            static::STATUS_UNKNOWN,
            static::STATUS_DONE,
            static::STATUS_NEW,
            static::STATUS_IMPORTANT,
        ];
    }

    public static function convertStatusLabel($label):int
    {
        return ($a = array_search($label, static::getStatuses())) !== false?$a:static::STATUS_UNKNOWN;
    }

    protected $fillable = [
        'type', 'source', 'order',
        'client_id', 'worker_id',
        'client_name',
        'client_phone', 'client_phone_contact',
        'email',
        'address_id', 'address',
        'subject', 'content',
        'status',
        'archived', 'temp'
    ];

    protected $casts = [
        'status' => 'integer',
        'order' => 'integer',
        'archived' => 'boolean',
        'temp' => 'boolean',
    ];

    public static function getExport(Carbon $from, Carbon $to): ?array
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        $letters = [];
        for($l = 'A'; $l < 'Z'; $l++)
            $letters[] = $l;

        $report = [[
            'Тип', 'Источник', 'ЛС клиента', 'ФИО', 'Номер телефона', 'Контактный номер телефона', 'E-mail', 'Адрес', 'Тема', 'Содержимое',
        ]];
        $width = sizeof($report[0]);
        try {
            $sheet->getStyle('A1:'.$letters[$width-1].'1')->applyFromArray([
                'font' => ['bold' => true],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER,],
            ]);
        }
        catch (Exception) {}


        $requests = self::query()
            ->where('created_at', '>=', $from->format('Y-m-d H:i:s'))
            ->where('created_at', '<=', $to->format('Y-m-d H:i:s'))
            ->where('archived', false)
            ->orderBy('created_at')
            ->orderBy('order')
            ->get();

        foreach($requests as $k => $request) {
            if($request->type == 'call')
                $color = 'FFFB7185';
            else if($request->type == 'done')
                $color = 'FF16A34A';
            else if($request->type == 'suggest')
                $color = 'FF6B7280';
            else
                $color = 'FFF97316';

            $sheet->getStyle('A'.($k+2))->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB($color);

            $client = $request->client;
            $entrance = $request->addressDB;
            $report[] = [
                match ($request->type) {
                    'call' => 'Звонок',
                    'done' => 'Завершена',
                    'suggest' => 'Предложение',
                    default => 'Заявка'
                },
                match ($request->source) {
                    "unisite" => 'Сайт uniphone.su',
                    "uniwork" => 'Добавлена оператором',
                    "tomoru" => 'Робот Tomoru'
                },
                $request->client_id?:'__Пусто__',
                !empty($request->client_name)?$request->client_name:($client?$client->name:'__Пусто__'),
                !empty($request->client_phone)?$request->client_phone:($client?$client->getPhones()[0] ?? '__Пусто__':'__Пусто__'),
                !empty($request->client_phone_contact)?$request->client_phone_contact:($client?$client->getPhones()[1] ?? '__Пусто__':'__Пусто__'),
                !empty($request->email)?$request->email:($client?$client->email:'__Пусто__'),
                !empty($request->address)?$request->address:($entrance?$entrance->getFull($client?$client->apartment:null, $client?$client->floor:null):'__Пусто__'),
                $request->subject?:'__Пусто__',
                $request->content?:'__Пусто__',
            ];
        }


//        $sheet->fromArray($report);
        foreach($report as $i => $row) {
            foreach($row as $j => $col) {
                $coords = $letters[$j].($i + 1);
                $sheet->setCellValueExplicit($coords, $col, DataType::TYPE_STRING2);
                $sheet->getStyle($coords)->getAlignment()->setWrapText(true)->setVertical(Alignment::VERTICAL_TOP);
                if($col == '__Пусто__')
                    $sheet->getStyle($coords)->getFont()->getColor()->setRGB('CCCCCC');
            }
        }

        $height = sizeof($requests) + 1;

        try {
            $sheet->getStyle('A1:'.$letters[$width-1].$height)->applyFromArray([
                'borders' => [
                    'outline' => ['borderStyle' => Border::BORDER_THIN],
                    'inside' => ['borderStyle' => Border::BORDER_THIN],
                ],
                'alignment' => ['indent' => 1],
            ]);
        } catch (Exception) {}

        $sheet->getStyle('A1');

        $name = 'Отчет по заявкам '.$from->format('d_m_Y H_i_s').' - '.$to->format('d_m_Y H_i_s');
        $sheet->setTitle('Отчёт');
        $spreadsheet->getProperties()->setTitle($name);

        for($i = 'A'; $i <= $letters[$width - 4]; $i++)
            $sheet->getColumnDimension($i)->setAutoSize(true);

        $spreadsheet->getActiveSheet()->getColumnDimension('H')->setWidth(50);
        $spreadsheet->getActiveSheet()->getColumnDimension('I')->setWidth(30);
        $spreadsheet->getActiveSheet()->getColumnDimension('J')->setWidth(75);


        Storage::disk('public')->makeDirectory('/xlsx');
        $path = Storage::disk('public')->path('/xlsx');
        $file = $path.'/'.$name.'.xlsx';
        $writer = new Xlsx($spreadsheet);
        try {
            $writer->save($file);
        }
        catch (\PhpOffice\PhpSpreadsheet\Writer\Exception) {
            return null;
        }

        return compact('file', 'name');
    }
}
