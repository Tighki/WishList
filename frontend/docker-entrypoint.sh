#!/bin/sh
set -eu

: "${API_UPSTREAM:=http://host.docker.internal:3001/api/}"

envsubst '${API_UPSTREAM}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf
exec nginx -g 'daemon off;'
