#!/bin/bash
turbo prune web --docker --out-dir apps/web/out
docker build \
  -f apps/web/dockerfile \
  -t web --progress=plain \
  $(grep -v '^#' apps/web/.env | sed 's/^/--build-arg /') \
  .
