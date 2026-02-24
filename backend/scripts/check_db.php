<?php

// Try to load Composer autoload (and Dotenv) if available
if (file_exists(__DIR__ . '/../../vendor/autoload.php')) {
    require __DIR__ . '/../../vendor/autoload.php';
    if (class_exists(\Dotenv\Dotenv::class)) {
        try {
            \Dotenv\Dotenv::createImmutable(__DIR__ . '/..')->safeLoad();
        } catch (Exception $e) {
            // continue
        }
    }
} else {
    // Fallback: parse backend/.env manually
    $envFile = __DIR__ . '/../.env';
    if (file_exists($envFile)) {
        $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            if (strpos(trim($line), '#') === 0) continue;
            if (strpos($line, '=') === false) continue;
            list($k, $v) = explode('=', $line, 2);
            $k = trim($k);
            $v = trim($v);
            $v = trim($v, "\"'");
            if (getenv($k) === false) putenv("{$k}={$v}");
            $_ENV[$k] = $v;
        }
    }
}

$dbUrl = getenv('DB_URL') ?: getenv('DATABASE_URL');

if ($dbUrl) {
    $parts = parse_url($dbUrl);
    $scheme = $parts['scheme'] ?? 'mysql';
    $user = $parts['user'] ?? '';
    $pass = $parts['pass'] ?? '';
    $host = $parts['host'] ?? '127.0.0.1';
    $port = $parts['port'] ?? '3306';
    $path = isset($parts['path']) ? ltrim($parts['path'], '/') : '';
} else {
    $scheme = getenv('DB_CONNECTION') ?: 'mysql';
    $user = getenv('DB_USERNAME') ?: '';
    $pass = getenv('DB_PASSWORD') ?: '';
    $host = getenv('DB_HOST') ?: '127.0.0.1';
    $port = getenv('DB_PORT') ?: ($scheme === 'pgsql' ? '5432' : '3306');
    $path = getenv('DB_DATABASE') ?: '';
}

try {
    if (in_array($scheme, ['mysql', 'mariadb'])) {
        $dsn = "mysql:host={$host};port={$port};dbname={$path};charset=utf8mb4";
        $opts = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ];
        $pdo = new PDO($dsn, $user, $pass, $opts);
        $stmt = $pdo->query('SELECT NOW()');
        $stmt->fetch();
        echo "Conexión exitosa\n";
        exit(0);
    } elseif (in_array($scheme, ['pgsql', 'postgres', 'postgresql'])) {
        $dsn = "pgsql:host={$host};port={$port};dbname={$path}";
        $pdo = new PDO($dsn, $user, $pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
        $stmt = $pdo->query('SELECT NOW()');
        $stmt->fetch();
        echo "Conexión exitosa\n";
        exit(0);
    } else {
        echo "Esquema no soportado: {$scheme}\n";
        exit(1);
    }
} catch (Exception $e) {
    echo "Error de conexión: " . $e->getMessage() . "\n";
    exit(1);
}
