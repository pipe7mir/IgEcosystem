#!/bin/sh
set -e
# Simple CI-friendly DB check for Laravel backend
cd "$(dirname "$0")/.." || exit 1
php scripts/check_db.php
