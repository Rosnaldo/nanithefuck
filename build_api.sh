#!/bin/bash
rm -rf apps/api/out
turbo prune api --docker --out-dir apps/api/out
docker build \
  -f apps/api/dockerfile \
  -t api --progress=plain \
  .
