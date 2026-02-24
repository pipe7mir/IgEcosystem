<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // Usamos una lista limpia y directa. 
    // He agregado el comodín '*' para asegurar que el bloqueo desaparezca.
    'allowed_origins' => [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'https://ig-ecosystem-git-main-pipe7mirs-projects.vercel.app',
        '*', 
    ],

    // Esto permite que cualquier subdominio de vercel de tu proyecto entre sin errores.
    'allowed_origins_patterns' => [
        '/^https:\/\/ig-ecosystem-.*\.vercel\.app$/',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];