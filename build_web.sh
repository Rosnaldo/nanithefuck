#!/bin/bash
turbo prune web --docker

docker build \
  -f apps/web/dockerfile \
  -t web \
  $(grep -v '^#' apps/web/.env | sed 's/^/--build-arg /') \
  .
