#!/bin/bash
docker build \
  -f apps/frontend/dockerfile \
  -t frontend \
  $(grep -v '^#' apps/frontend/.env | sed 's/^/--build-arg /') \
  .
