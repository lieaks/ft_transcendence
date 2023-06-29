FROM node:20-alpine

ENV NODE_ENV production

WORKDIR /var/www/nestjs

COPY ./backend .
COPY ./docker/backend-start.sh .
COPY ./docker/backend.env .env

RUN npm ci @nestjs/cli --production=false
RUN npm run build
RUN apk add --no-cache curl

CMD [ "sh", "backend-start.sh" ]
