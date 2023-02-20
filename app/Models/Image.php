<?php

namespace App\Models;

use Cog\Contracts\Love\Reactable\Models\Reactable as ReactableInterface;
use Cog\Laravel\Love\Reactable\Models\Traits\Reactable;
use Illuminate\Database\Eloquent\Model;


class Image extends Model implements ReactableInterface
{
    use Reactable;
    protected $guarded = ['id'];
}
