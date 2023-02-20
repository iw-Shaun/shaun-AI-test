<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <title>AGILITY-DEV</title>
        <link rel="stylesheet" href="{{ mix('css/app.css') }}?ver={{ $appVer }}" type="text/css" />
        <style>
            #__vconsole {
                display: none;
            }
        </style>
        <script type="text/javascript" src="/js/vconsole.min.js"></script>
        <script>
            var vConsole = new VConsole();
            window.appUrl = '{{ $appUrl }}';
            window.assetUrl = function(path) {
                return '{{ $assetUrl }}' + path + '?ver={{ $appVer }}';
            }
            window.oaUrl = '{{ $oaUrl }}';
            window.liffId = '{{ $liffId }}';
            window.liffUrl = '{{ $liffUrl }}';
        </script>
    </head>
    <body>
        <div id="app"></div>
        <div id="my-modal"></div>
        <script src="{{ mix('js/app.js') }}?ver={{ $appVer }}"></script>
    </body>
</html>
