FROM node:20-alpine

ENV NODE_ENV production

WORKDIR /var/www/nestjs

COPY ./backend .
COPY ./docker/backend-start.sh .

RUN npm ci @nestjs/cli

CMD [ "sh", "backend-start.sh" ]
