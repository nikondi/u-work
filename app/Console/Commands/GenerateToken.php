<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class GenerateToken extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:generate-token {user_id} {type=api} {--clear}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $user_id = $this->argument('user_id');
        $user = User::find($user_id);
        if($user === null)
            $user = User::where('login', $user_id)->first();

        if($user === null)
            $this->error('Пользователь не найден');

        if($this->option('clear'))
            $user->tokens()->delete();

        $this->info('Token: '.$user->createToken($this->argument('type'), ['*'], now()->addYears(1))->plainTextToken);

    }
}
