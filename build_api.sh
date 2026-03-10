#!/bin/bash

# Exit immediately if a command fails
set -e

# Check for required argument
if [ -z "$1" ]; then
  echo "Usage: $0 [prod|dev]"
  exit 1
fi

ENV="$1"

# Determine which Dockerfile to use
if [ "$ENV" = "prod" ]; then
  DOCKERFILE="apps/api/dockerfile.prod"
elif [ "$ENV" = "dev" ]; then
  DOCKERFILE="apps/api/dockerfile.dev"
else
  echo "Invalid argument: $ENV"
  echo "Use 'prod' or 'dev'"
  exit 1
fi

echo "Building Docker image using $DOCKERFILE..."

# Clean output directory
rm -rf apps/api/out

# Prune dependencies for Docker
turbo prune api --docker --out-dir apps/api/out

# Build Docker image
docker build \
  -f "$DOCKERFILE" \
  -t api --progress=plain \
  .

echo "Docker image api built successfully!"