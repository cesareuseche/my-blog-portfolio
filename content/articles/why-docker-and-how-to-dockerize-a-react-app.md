---
title: "Why Docker & How to Dockerize a NextJS App"
date: "March 28th 2025"
description: "Learn why Docker is essential for modern development and how to containerize a NextJS app with a step-by-step guide."
image: "/assets/images/docker.webp"
tag: "Docker 🐋"
id: 3
author: "Cesar Useche"
duration: "~8 min"
category: "TECH+++"
---

## Why Use Docker?

As a software engineer, having a reliable development environment is crucial. Engineers should be able to work without worrying about Node.js versions or manually installing dependencies. This is where Docker becomes invaluable.

Docker is a powerful tool that simplifies software deployment by containerizing applications and their dependencies. Here’s why using Docker is essential:

Consistency Across Environments: Docker ensures your application runs the same way across different environments, eliminating the "it works on my machine" problem.

Simplified Dependency Management: Instead of manually configuring dependencies, Docker encapsulates everything inside a container.

Efficient Resource Utilization: Unlike traditional virtual machines, Docker containers share the host OS kernel, making them lightweight and faster to spin up.

Scalability and Deployment: Docker enables effortless scaling across multiple environments using container orchestration tools like Docker Swarm or Kubernetes, ensuring high availability and efficient resource allocation.

Portability: Since Docker packages everything needed to run an application, moving it between development, testing, and production is seamless.

## How to Dockerize a NextJS App

Follow this step-by-step guide to containerizing a Next.js application with Docker.

### 1. Create a Next App (Skip if You Already Have One)

If you don’t have a Next app yet, create one using:
```sh
npx create-next-app@latest my-next-app
cd my-next-app
```

### 2. Create a `Dockerfile`

In the root directory of your Next project, create a file named `Dockerfile` with the following content:

```Dockerfile

# Use Node.js base image
FROM node:20.18.0-bookworm AS base

# Set working directory inside the container
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm@9.14.1

# Copy package.json and lockfile before installing dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy the entire application source code
COPY . .

# Build the Next.js application
FROM base AS builder
RUN pnpm run build

# Create a lightweight production image
FROM node:20.18.0-bookworm AS production
WORKDIR /app

# Install pnpm (needed to run the Next.js server)
RUN npm install -g pnpm

# Set environment variables for production
ENV NODE_ENV=production

# Copy only necessary files from the builder stage
COPY --from=builder /app/package.json /app/
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/public /app/public
COPY --from=builder /app/next.config.js /app/next.config.js

# Expose port 3000 for the Next.js server
EXPOSE 3000

# Start the Next.js production server
CMD ["pnpm", "start"]

```

### 3. Create a `.dockerignore` File

To prevent unnecessary files from being copied to the container, create a `.dockerignore` file:

```sh
node_modules
build
.dockerignore
Dockerfile
docker-compose.yml
.git
```

### 4. Build the Docker Image

Run the following command to build your Docker image:

```sh
docker build -t my-next-app .
```

### 5. Run the Docker Container

Once the image is built, start a container using:
```sh
docker run -p 3000:3000 my-next-app
```
Your React app should now be accessible at `http://localhost:3000`.

### 6. Using Docker Compose (Optional)

For easier management, you can use Docker Compose. Create a `docker-compose.yml` file:

```yaml
services:
  next-app:
    container_name: blog-portfolio
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    volumes:
      - .:/app:cached
      - /app/node_modules
    working_dir: /app
    stdin_open: true
    tty: true
    networks:
      - react-network
    environment:
      - CHOKIDAR_USEPOLLING=true
      - WATCHPACK_POLLING=true
      - NEXTJS_IGNORE_ESLINT=1
    command: ["pnpm", "dev", "--turbo"]

networks:
  react-network:
    driver: bridge

```

Then run:
```sh
docker-compose up -d
```

### 7. Create Helper Scripts for Shorter Commands

To simplify Docker commands, create helper scripts:

#### `up` (Make it executable: `chmod +x up`)
```sh
#!/bin/bash
docker-compose up
```

#### `down` (Make it executable: `chmod +x down`)
```sh
#!/bin/bash
docker-compose down
```

#### `build` (Make it executable: `chmod +x build`)
```sh
#!/bin/bash
docker-compose build
```

Now, you can use:
```sh
./up      # Start the containers
./down    # Stop the containers
./build   # Rebuild the images
```

## Additional Resources

For beginners looking for a complete introduction to Docker, check out this video:

[Docker Crash Course for Absolute Beginners](https://www.youtube.com/watch?v=pg19Z8LL06w)

In addition to the video, the official [Docker documentation](https://docs.docker.com/) provides comprehensive resources for learning Docker.

## Conclusion

Docker streamlines development by ensuring a consistent environment, eliminating dependency conflicts, and simplifying deployment. Whether you're working solo or on a team, Docker makes it easy to build, test, and scale Next.js applications.

By following this guide, you now have a fully containerized Next.js application that can be easily deployed across different environments. Try integrating CI/CD pipelines like GitHub Actions or using Docker Compose for local development to further enhance your workflow.

Start using Docker today and take your Next.js development to the next level! 🐋