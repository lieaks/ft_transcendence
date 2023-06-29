FROM node:20-alpine

WORKDIR /var/www/vitejs

COPY ./frontend .
COPY ./docker/frontend.env .env

RUN apk add --no-cache curl
RUN npm ci --production=false
RUN npm run build

ENV NODE_ENV production

CMD [ "npx", "vite", "preview", "--port", "8080", "--host" ]
