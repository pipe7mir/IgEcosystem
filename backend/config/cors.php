<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // Agregamos la URL de tu proyecto en Vercel a la lista
    'allowed_origins' => [
        'http://localhost:5173', 
        'http://127.0.0.1:5173',
        'https://ig-ecosystem-git-main-pipe7mirs-projects.vercel.app'
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];