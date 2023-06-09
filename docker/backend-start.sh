# echo "DATABASE_URL=\"postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:5432/${POSTGRES_DB}?schema=public\"" > .env
npx prisma db push
node dist/src/main.js
