<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <meta http-equiv="refresh" content="0; url={!! $redirectUrl !!}" />
        <title></title>
        <style>
            body, .container {
                width: 100vw;
                height: 100vh;
                margin: 0;
                padding: 0;
            }
            .container {
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .btn {
                background-color: #81e3c2;
                padding: 5px 14px;
                border-radius: 16px;
                font-size: 12px;
                color: #fff;
                text-decoration: none;
            }
        </style>
        <script>
            // Redirect.
            setTimeout(function() {
                window.location.href = '{!! $redirectUrl !!}';
            }, 2000);
        </script>
    </head>
    <body>
        <div class="container">
            <a href="{!! $redirectUrl !!}" class="btn"></a>
        </div>
    </body>
</html>
