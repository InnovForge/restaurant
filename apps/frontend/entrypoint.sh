#!/bin/sh
# entrypoint.sh
: "${VITE_APP_API_URL:=}"

sed -i "s|%%VITE_APP_API_URL%%|$VITE_APP_API_URL|g" /app/dist/env-config.js

exec "$@"

