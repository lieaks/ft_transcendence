# Use a Node.js base image
FROM node:lts

# Set the working directory in the container
WORKDIR /var/www/prisma-studio

COPY ./backend/prisma/schema.prisma .
COPY ./docker/prisma-studio-start.sh .

# Install Prisma globally
RUN npm install -g prisma

# Run Prisma Studio
CMD ["sh", "prisma-studio-start.sh"]
