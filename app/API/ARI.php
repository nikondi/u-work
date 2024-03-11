<?php

namespace App\API;

use App\Helpers\ErrorsHelper;
use BadMethodCallException;
use Exception;
use Throwable;

/**
 * @method getLogin
 * @method getUrl
 * @method getPassword
 * @method getApp
 * @method getHost
 * */
class ARI {
    private string $url;
    private string $login = 'test';
    private string $password = 'test';
    private string $app = 'test';
    private string $host = '127.0.0.1';
    private bool $is_https = false;

    public function __construct()
    {
        $this->is_https = config('ari.is_https', $this->is_https);
        $this->host = config('ari.host', $this->host);
        $this->url = ($this->is_https?'https':'http').'://'.$this->host.'/';
        $this->app = config('ari.app', $this->app);
        $this->login = config('ari.login', $this->login);
        $this->password = config('ari.password', $this->password);
    }

    public function __call(string $name, array $arguments)
    {
        if(str_starts_with($name, 'get') && in_array(substr($name, 3), ['Login', 'Password', 'App', 'Url', 'Host'])) {
            $snake = strtolower(preg_replace('/(?<!^)[A-Z]/', '_$0', substr($name, 3)));
            return $this->{$snake};
        }
        throw new BadMethodCallException();
    }


    private function method($method): array|null
    {
        try {
//            $result = VPN::sendCommand('curl -s '.$this->url.$method.' --user "'.$this->login.':'.$this->password.'"');

            $ch = curl_init($this->url.'ari/'.$method);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_USERPWD, "$this->login:$this->password");
            curl_setopt($ch, CURLOPT_HEADER, false);

            $result = curl_exec($ch);
            curl_close($ch);

            if(empty($result))
                ErrorsHelper::throw(new Exception('Запрос вернул пустой результат'));
//            return json_decode(implode('', $result), JSON_OBJECT_AS_ARRAY);
            return json_decode($result, JSON_OBJECT_AS_ARRAY);
        }
        catch (Throwable $e) {
            ErrorsHelper::throw(new Exception('Ошибка при получении устройств: '.$e->getMessage()));
        }
    }

    /**
     * @return array{sip: int, }[] | null
     */
    public function getPeers(): array|null
    {
        $peers = $this->method('endpoints/SIP');
        foreach($peers as &$peer) {
            if(isset($peer['resource'])) {
                $peer['sip'] = $peer['resource'];
                unset($peer['resource']);
            }
        }

        return $peers;
    }
    public function getPeer($sip): array|null
    {
        $peer = $this->method('endpoints/SIP/'.$sip);
        if(isset($peer['resource'])) {
            $peer['sip'] = $peer['resource'];
            unset($peer['resource']);
        }
        return $peer;
    }
    public function applications(): array|null
    {
        return $this->method('applications');
    }
}
