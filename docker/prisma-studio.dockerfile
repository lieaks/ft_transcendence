# Use a Node.js base image
FROM node:lts

ARG POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
ARG POSTGRES_USER=${POSTGRES_USER}
ARG POSTGRES_DB=${POSTGRES_DB}
ARG POSTGRES_HOST=${POSTGRES_HOST}

# Set the working directory in the container
WORKDIR /app

COPY ./backend/prisma/schema.prisma .

RUN echo "DATABASE_URL=\"postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:5432/${POSTGRES_DB}?schema=public\"" > .env

# Install Prisma globally
RUN npm install -g prisma

# Run Prisma Studio
CMD ["prisma", "studio"]
