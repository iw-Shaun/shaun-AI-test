## Requirement tools
- composer
- npm

## Initial project
Install packages
```
$ composer install
$ npm install .
```

Create the config file
```
$ cp .env.example .env
```

Generate server key
```
$ php artisan key:generate
```

Create new database and related account

Set the database name and account to config file `.env`

```
DB_PORT=3306
DB_DATABASE=xxx
DB_USERNAME=ooo
DB_PASSWORD=xxx
```

Create db schema by migration
```
$ php artisan migrate
```

Link the storage folder to public
```
$ php artisan storage:link
```

Start web server
```
$ php artisan serve
Laravel development server started: <http://127.0.0.1:8000>
```

Start hot reload mode for frontend development
```
$ npm run hot
DONE  Compiled successfully in 259ms
```
Add Laravel-Love Default Types
```
$ php artisan love:reaction-type-add --default
```