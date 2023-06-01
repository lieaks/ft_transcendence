FROM node:18-alpine

ENV NODE_ENV production

WORKDIR /var/www/nestjs

COPY package*.json .
COPY ./backend .
COPY ./docker/backend-start.sh .

RUN npm ci @nestjs/cli

CMD [ "sh", "backend-start.sh" ]
