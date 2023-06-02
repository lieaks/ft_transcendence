FROM node:20-alpine

WORKDIR /var/www/prisma-studio

COPY ./backend/prisma/schema.prisma .
COPY ./docker/prisma-studio-start.sh .

RUN npm install -g prisma

CMD ["sh", "prisma-studio-start.sh"]
