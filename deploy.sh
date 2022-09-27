#!/bin/sh

set -e

if [ -z "$SSH_HOST" ]; then
  echo "SSH_HOST is not set. Quitting."
  exit 1
fi

if [ -z "$SSH_PORT" ]; then
  echo "SSH_PORT is not set. Defaulting to 22."
  $SSH_PORT = 22
fi

if [ -z "$SSH_PASSWORD" ]; then
  echo "SSH_PASSWORD is not set. Quitting."
  exit 1
fi

echo "hi $SSH_HOST"