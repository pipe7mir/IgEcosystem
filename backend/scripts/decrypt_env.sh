#!/bin/sh
set -e
# Usage in deployment: ENV_SECRET=$SECRET_FROM_VAULT ./decrypt_env.sh
if [ ! -f .env.enc ]; then
  echo ".env.enc not found in backend/" >&2
  exit 2
fi
if [ -z "$ENV_SECRET" ]; then
  echo "Set ENV_SECRET environment variable with the passphrase" >&2
  exit 3
fi
openssl enc -d -aes-256-cbc -in .env.enc -out .env -pass pass:"$ENV_SECRET"
echo "Decrypted .env from .env.enc"
