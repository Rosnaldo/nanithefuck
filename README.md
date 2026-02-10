turbo run build --filter=@repo/shared-types

turbo run dev --filter=backend

npm install -d @types/express --workspace apps/payment

npx shadcn@latest add button


### rebuild image 
docker compose build --no-cache frontend 


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
