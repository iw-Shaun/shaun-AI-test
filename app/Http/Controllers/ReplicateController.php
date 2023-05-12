<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Request as HttpRequest;
use GuzzleHttp\Exception\RequestException;
use GuzzleHttp\Exception\ConnectException;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

const HTTP_TIMEOUT = 15;

class ReplicateController extends Controller
{
    const METHOD_GET = 'GET';
    const METHOD_POST = 'POST';
    const METHOD_DELETE = 'DELETE';

    private static function sendRequest($method, $api, $data=null)
    {
        $url = 'https://api.replicate.com';
        $api = $url.$api;

        $accessToken = '1fcc38a273d858169d216d0db0df1741fddafb85';

        $header = [
            'Authorization' => "Token {$accessToken}",
        ];

        if (isset($data))
            $body = json_encode($data);

        $client = new Client([
            'base_uri' => $url,
            'timeout'  => HTTP_TIMEOUT,
            //verify false
            // 'verify' => false
        ]);

        Log::info(print_r(isset($data),1));
        if (isset($body))
            $request = new HttpRequest($method, $api, $header, $body);
        else
            $request = new HttpRequest($method, $api, $header);
        
        try {
            Log::info('-----------------try-----------------');
	        $response = $client->send($request);
            $code = $response->getStatusCode();
            $reason = $response->getReasonPhrase();
            $body = $response->getBody();
            $json = json_decode($body, true);
            Log::info(print_r($response,1));
            return $json;
        } catch (RequestException $e) {
            Log::info("-----------------catch-----------------{$e}");
            if ($e->hasResponse()) {
                $res = $e->getResponse();
                $code = $res->getStatusCode();
                $body = $res->getBody();
            }
        } catch (ConnectException $e) {
            Log::info('-----------------catch-----------------');
        }
    }

    public static function getAI(Request $request)
    {
        $data = $request->input('data');

        $res = self::sendRequest(self::METHOD_POST, '/v1/predictions', $data);
        return $res;
    }

    public static function getResponse($id)
    {
        $res = self::sendRequest(self::METHOD_GET, "/v1/predictions/{$id}");
        return $res;
    }
}
