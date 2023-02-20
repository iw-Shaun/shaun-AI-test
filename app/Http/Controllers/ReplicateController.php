<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Request as Request;
use GuzzleHttp\Exception\RequestException;
use GuzzleHttp\Exception\ConnectException;
use App\Http\Controllers\Controller;

const HTTP_TIMEOUT = 15;

class ReplicateController extends Controller
{
    const METHOD_GET = 'GET';
    const METHOD_POST = 'POST';
    const METHOD_DELETE = 'DELETE';

    private static function sendRequest($method, $api, $data=[])
    {
        $url = 'https://api.replicate.com';
        $api = $url.$api;

        Log::info(print_r($data,1));
        $accessToken = '1fcc38a273d858169d216d0db0df1741fddafb85';

        $header = [
            'Authorization' => "Token {$accessToken}",
        ];
        $body = json_encode([
            "version"=> "9222a21c181b707209ef12b5e0d7e94c994b58f01c7b2fec075d2e892362f13c",
            "input"=> [
                "image"=> $data['photo'],
                "target_age"=> "10"
            ]
        ]);

        $client = new Client([
            'base_uri' => $url,
            'timeout'  => HTTP_TIMEOUT,
            //verify false
            'verify' => false
        ]);
        $request = new Request($method, $api, $header, $body);
        
        try {
            Log::info('-----------------try-----------------');
	        $response = $client->send($request);
            $code = $response->getStatusCode();
            $reason = $response->getReasonPhrase();
            $body = $response->getBody();
            $json = json_decode($body, true);
            return $json;
        } catch (RequestException $e) {
            Log::info("-----------------catch-----------------");
            if ($e->hasResponse()) {
                $res = $e->getResponse();
                $code = $res->getStatusCode();
                $body = $res->getBody();
            }
        } catch (ConnectException $e) {
            Log::info('-----------------catch-----------------');
        }
    }

    public static function getAI($photo)
    {
        $res = self::sendRequest(self::METHOD_POST, '/v1/predictions/', ['photo' => $photo]);
        return $res;
    }
}
