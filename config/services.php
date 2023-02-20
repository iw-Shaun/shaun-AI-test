<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'line' => [
        'oaUrl' => env('LINE_OA_URL'),
        'loginChannelId' => env('LINE_LOGIN_CHANNEL_ID'),
        'liffId' => env('LINE_LIFF_ID'),
        'liffUrl' => env('LIFE_LIFF_URL'),
        'channelAccessToken' => env('LINEBOT_CHANNEL_ACCESS_TOKEN'),
        'channelSecret' => env('LINEBOT_CHANNEL_SECRET'),
    ],

    'cresclab' => [
        'dev' => [
            'token' => env('CRESCLAB_DEV_TOKEN'),
        ],
        'prod' => [
            'token' => env('CRESCLAB_PROD_TOKEN'),
        ],
        'deepLink' => [
            '1' => env('CRESCLAB_DEEP_LINK_1'),
            '2' => env('CRESCLAB_DEEP_LINK_2'),
            '3' => env('CRESCLAB_DEEP_LINK_3'),
            '4' => env('CRESCLAB_DEEP_LINK_4'),
            '5' => env('CRESCLAB_DEEP_LINK_5'),
            '6' => env('CRESCLAB_DEEP_LINK_6'),
            '7' => env('CRESCLAB_DEEP_LINK_7'),
            '8' => env('CRESCLAB_DEEP_LINK_8'),
            '9' => env('CRESCLAB_DEEP_LINK_9'),
            '10' => env('CRESCLAB_DEEP_LINK_10'),
            '11' => env('CRESCLAB_DEEP_LINK_11'),
            '12' => env('CRESCLAB_DEEP_LINK_12'),
            '13' => env('CRESCLAB_DEEP_LINK_13'),
            '14' => env('CRESCLAB_DEEP_LINK_14'),
            '15' => env('CRESCLAB_DEEP_LINK_15'),
            '16' => env('CRESCLAB_DEEP_LINK_16'),
            '17' => env('CRESCLAB_DEEP_LINK_17'),
            '18' => env('CRESCLAB_DEEP_LINK_18'),
        ],
    ],
];
