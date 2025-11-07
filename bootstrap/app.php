<?php

use App\Http\Middleware\SystemLogRequestsMiddleware;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\ShareNotifications;
use App\Http\Middleware\Authenticate;
use App\Http\Middleware\EnsureUserIsAdmin;
use App\Http\Middleware\EnsureUserIsRecordOfficer;
use App\Http\Middleware\EnsureUserIsLawEnforcement;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
            ShareNotifications::class,
            SystemLogRequestsMiddleware::class,
        ]);

        // Register middleware aliases
        $middleware->alias([
            'auth' => Authenticate::class,
            'admin' => EnsureUserIsAdmin::class,
            'record.officer' => EnsureUserIsRecordOfficer::class,
            'law.enforcement' => EnsureUserIsLawEnforcement::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
