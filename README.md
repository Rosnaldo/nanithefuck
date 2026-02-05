turbo run build --filter=@repo/shared-types

turbo run dev --filter=backend

npm install -d @types/express --workspace apps/payment
npm install -d ts-morph --workspace @repo/shared-types

npx shadcn@latest add button
