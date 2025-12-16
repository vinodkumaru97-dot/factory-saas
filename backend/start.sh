#!/bin/sh
set -e

# Run Prisma migrations (deploy) then start the Node app
if [ -n "$DATABASE_URL" ]; then
  echo "Running Prisma migrations..."
  npx prisma migrate deploy --schema=prisma/schema.prisma
else
  echo "DATABASE_URL not set; skipping migrations"
fi

echo "Starting app"
node dist/index.js
