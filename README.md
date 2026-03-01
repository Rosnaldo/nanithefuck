turbo run build --filter=@repo/shared-types

turbo run dev --filter=backend

npm install -d @types/express --workspace apps/payment


## start docker-composer
docker compose -f docker-compose.dev.yml up

## rebuild image and container
docker compose -f docker-compose.dev.yml up -d --build web

## restart nginx 
docker compose -f docker-compose.dev.yml exec -it nginx nginx -s reload

npx shadcn@latest add button

## verify volume content
docker run --rm -it -v nanithefuck_web_dist:/data alpine sh

## connect to ec2 
ssh -i "nanithefuck.pem" ec2-user@ec2-15-228-242-64.sa-east-1.compute.amazonaws.com

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


## ec2 install
sudo apt update
sudo apt install -y docker.io
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker $USER  # optional to run docker without sudo

