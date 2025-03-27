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

When you work as a software engineer, having a reliable development environment is crucial. All engineers should be able to work without worrying about their Node.js version or manually installing dependencies. This is where Docker comes in handy. Docker is a powerful tool that simplifies software deployment by containerizing applications and their dependencies. Here’s why using Docker is crucial:

1. **Consistency Across Environments**: Docker ensures your application runs the same way across different environments, eliminating the "it works on my machine" problem.
2. **Simplified Dependency Management**: Instead of manually configuring dependencies, Docker encapsulates everything inside a container.
3. **Efficient Resource Utilization**: Unlike traditional virtual machines, Docker containers share the host OS kernel, making them lightweight and faster to spin up.
4. **Scalability and Deployment**: With Docker, you can effortlessly scale your application across multiple environments using container orchestration tools like Docker Swarm or Kubernetes. This ensures high availability and efficient resource allocation.
5. **Portability**: Since Docker packages everything needed to run an application, moving it between development, testing, and production is seamless.

## How to Dockerize a Next.js App

Here’s a step-by-step guide to containerizing a Next.js app with Docker.

### 1. Create a Next.js App (Skip if You Already Have One)

If you don’t have a Next.js app yet, create one using:

```sh
npx create-next-app@latest my-next-app
cd my-next-app
```

### 2. Create a `Dockerfile`

In the root directory of your Next.js project, create a `Dockerfile` with the following content:

```Dockerfile
# --- Base Image ---
FROM node:20.18.0-bookworm AS base

# Set up environment variables
ENV NODE_ENV=development \
    SHELL=/bin/bash \
    TMP_DIR=/mnt/tmp \
    WORKDIR=/app

WORKDIR ${WORKDIR}

# Install system dependencies
RUN apt-get update && apt-get install -y tini && rm -rf /var/lib/apt/lists/*

# Install pnpm globally
RUN npm install -g pnpm@9.14.1

# Set up pnpm cache
ENV npm_config_cache="${TMP_DIR}/npm-cache" \
    npm_config_store_dir="${TMP_DIR}/pnpm-store"

# Copy dependencies first (to leverage Docker caching)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy the entire project
COPY . .

# --- Development Stage ---
FROM base AS dev
CMD ["pnpm", "dev"]

# --- Production Stage ---
FROM base AS prod
ENV NODE_ENV=production
RUN pnpm run build
CMD ["pnpm", "start"]

# Use tini for process management
ENTRYPOINT ["/usr/bin/tini", "-sg", "--"]

EXPOSE 3000
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

### 4. Create a `docker-compose.yml` File

To simplify container management, use Docker Compose. Create a `docker-compose.yml` file:

```yaml
services:
  next-app:
    container_name: blog-portfolio
    build:
      context: .
      dockerfile: Dockerfile
      target: dev  # Default to development
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

### Explanation of why I have this type of Setup

1. **Multi-Stage Build:**
   - The `base` stage installs dependencies and sets up the environment.
   - The `dev` stage runs `pnpm dev` for development.
   - The `prod` stage builds the app and runs it in production mode with `pnpm start`.

2. **Using Tini:**
   - `tini` is a minimal `init` system that helps manage zombie processes inside Docker containers.
   - It prevents issues with improperly handled signals when stopping the container.

3. **Optimized Caching:**
   - Dependencies (`package.json` and `pnpm-lock.yaml`) are copied first to leverage Docker’s layer caching mechanism, reducing build time.

4. **Docker Compose:**
   - The `docker-compose.yml` file simplifies running the container by defining volumes, networks, and environment variables.
   - It uses `volumes` to mount the project directory, ensuring changes are reflected in real-time.

### 5. Build the Docker Image

Run the following command to build your Docker image:

```sh
docker build -t my-next-app .
```

### 6. Run the Docker Container

Once the image is built, start a container using:

```sh
docker run -p 3000:3000 my-next-app
```

Your Next.js app should now be accessible at `http://localhost:3000`.

### 7. Using Docker Compose

Run the following command to start your application:

```sh
docker-compose up -d
```

### 8. Create Helper Scripts for Shorter Commands

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

By following this guide, you now have a fully containerized Next.js application that can be easily deployed across different environments. I hope this article has been helpful, dockerizing an application can be challenging at first, but I’ve aimed to explain the process as clearly and thoroughly as possible.

Start using Docker today and take your Next.js development to the next level! 🐋

