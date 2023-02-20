<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateImagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('images', function (Blueprint $table) {
            $table->id();
            // $table->string('type');
            // $table->bigInteger('message_id')->unsigned();
            // $table->foreign('message_id')->references('id')->on('messages')->onDelete('cascade');
            $table->string('name');
            $table->string('season');
            $table->string('cover_image');
            $table->string('cover_thumb');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('images');
    }
}
