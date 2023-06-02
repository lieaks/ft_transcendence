FROM node:20-alpine

WORKDIR /var/www/vitejs

COPY ./frontend .

RUN npm ci --production=false

ENV NODE_ENV production

CMD [ "npm", "run", "build" ]
