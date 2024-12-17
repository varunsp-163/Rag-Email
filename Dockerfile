FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project to the container, including the prisma directory
COPY . .

# Ensure the prisma schema is available and generate Prisma client
RUN npx prisma generate --schema=./prisma/schema.prisma

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"]
