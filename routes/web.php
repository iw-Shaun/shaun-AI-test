<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RootController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ReplicateController;

//test
use Intervention\Image\Facades\Image;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Route::get('/alive', function () {
    return 'Y';
});

Route::get('/tracking_event', [UserController::class, 'trackingEvent'])->middleware('auth');
Route::group(['prefix' => 'laravel-filemanager'], function () {
    \UniSharp\LaravelFilemanager\Lfm::routes();
});
Route::get('/auth', [UserController::class, 'auth']);
Route::post('/login', [UserController::class, 'login']);
Route::post('/store', [UserController::class, 'store']);


Route::get('/{path?}', [RootController::class, 'show'])->where('path', '.*');
