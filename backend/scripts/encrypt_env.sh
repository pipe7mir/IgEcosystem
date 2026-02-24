#!/bin/sh
set -e
# Usage: ENV_SECRET=your-secret ./encrypt_env.sh
if [ ! -f .env ]; then
  echo ".env not found in backend/" >&2
  exit 2
fi
if [ -z "$ENV_SECRET" ]; then
  echo "Set ENV_SECRET environment variable with a strong passphrase" >&2
  exit 3
fi
openssl enc -aes-256-cbc -salt -in .env -out .env.enc -pass pass:"$ENV_SECRET"
echo "Encrypted .env -> .env.enc"
