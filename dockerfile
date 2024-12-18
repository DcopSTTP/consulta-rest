# Base image
FROM node:18.17.1 as build

# Set working directory
WORKDIR /app

# Copy the rest of the application code
COPY . .

# Build the app
EXPOSE 5174
CMD ["npx", "serve", "-s", "dist", "-p", "5174"]