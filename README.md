turbo run build --filter=@repo/shared-types

turbo run dev --filter=backend

npm install -d @types/express --workspace apps/payment

docker compose -f docker-compose.dev.yml up

npx shadcn@latest add button

# verify volume content
docker run --rm -it -v nanithefuck_web_dist:/data alpine sh


### clean cache
docker builder prune
- build cache
- imagens não usadas
- containers parados

docker compose down -v
- volumes do compose (cache de deps, db, etc.)

### clean dangling images
docker image prune

### clean all
docker system prune -a
