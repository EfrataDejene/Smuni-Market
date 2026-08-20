<?php

namespace App\Providers;

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     * Set a shorter default string length to avoid MySQL "key too long" errors
     * on servers that use the latin1 charset or have a small innodb_large_prefix.
     */
    public function boot(): void
    {
        Schema::defaultStringLength(191);
    }
}
