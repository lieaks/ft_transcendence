FROM node:20-alpine

WORKDIR /var/www/prisma-studio

COPY ./backend/prisma/schema.prisma .
COPY ./docker/.env .

RUN npm install -g prisma

CMD ["prisma", "studio", "--browser", "none"]
