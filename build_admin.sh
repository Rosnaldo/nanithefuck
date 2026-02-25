#!/bin/bash
turbo prune admin --docker --out-dir apps/admin/out
docker build \
  -f apps/admin/dockerfile \
  -t myadmin --progress=plain \
  $(grep -v '^#' apps/admin/.env.dev | sed 's/^/--build-arg /') \
  .
