---
title: "Why Docker & How to Dockerize a NextJS App"
date: "March 28th 2025"
description: "Learn why Docker is essential for modern development and how to containerize a NextJS app with a step-by-step guide."
image: "/assets/images/docker-illus.webp"
tag: "Docker 🐋"
id: 3
author: "Cesar Useche"
duration: "~8 min"
category: "TECH+++"
---

## Why Use Docker?

When you work as a software engineer, having a reliable development environment is crucial. Engineers should be able to work without worrying about their Node.js version or manually installing dependencies. This is where Docker comes in. Docker is a powerful tool that simplifies software deployment by containerizing applications and their dependencies.

Here’s why Docker is essential:

1. **Consistency Across Environments**: Docker ensures your application behaves the same way across different systems, eliminating the "it works on my machine" issue.

2. **Simplified Dependency Management**: Docker encapsulates dependencies, avoiding manual setup.

3. **Efficient Resource Utilization**: Docker containers are lightweight and share the host OS kernel, unlike traditional virtual machines.

4. **Scalability and Deployment**: Docker enables horizontal scaling with tools like Docker Swarm and Kubernetes.

5. **Portability**: Containers can seamlessly move between development, staging, and production environments.

## How to Dockerize a Next.js App

Here’s a step-by-step guide to containerizing a Next.js app using Docker.

### 1. Create a Next.js App

If you don’t already have one:

```sh
npx create-next-app@latest my-next-app
cd my-next-app
```

### 2. Create a `Dockerfile`

In your project root:

```Dockerfile
# --- Base Image ---
FROM node:20.18.0-bookworm AS base

# --- Set Environment Variables ---
ENV NODE_ENV=development \
    SHELL=/bin/bash \
    TMP_DIR=/mnt/tmp \
    WORKDIR=/app

WORKDIR ${WORKDIR}

# --- System Dependencies ---
RUN apt-get update && apt-get install -y tini && rm -rf /var/lib/apt/lists/*

# --- Install pnpm ---
RUN npm install -g pnpm@9.14.1

# --- Set Up pnpm Cache ---
ENV npm_config_cache="${TMP_DIR}/npm-cache" \
    npm_config_store_dir="${TMP_DIR}/pnpm-store"

# Copy dependency files and install packages
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy app source code
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

### 3. Create `.dockerignore`

To reduce build context:

```sh
node_modules
build
.dockerignore
Dockerfile
docker-compose.yml
.git
```

### 4. Create `docker-compose.yml`

```yaml
services:
  next-app:
    container_name: blog-portfolio
    build:
      context: .
      dockerfile: Dockerfile
      target: dev
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

### Why This Setup?

- **Multi-Stage Builds**: Separate stages for base, development, and production.

- **Tini for Signal Handling**: Prevents zombie processes.

- **Docker Cache Optimization**: Layer caching speeds up builds.

- **Docker Compose**: Simplifies orchestration.

### 5. Build the Image

```sh
docker build -t my-next-app .
```

### 6. Run the Container

```sh
docker run -p 3000:3000 my-next-app
```

### 7. Use Docker Compose

```sh

# Uses BuildKit for faster, optimized builds
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

docker compose up --build
```

### 8. Create Helper Scripts

#### `up`
```sh
#!/bin/bash
docker compose up
```

#### `down`
```sh
#!/bin/bash
docker compose down
```

#### `build`
```sh
#!/bin/bash
docker-compose build
```

Run with:
```sh
./up
./down
./build
```

## Troubleshooting

Here are some common issues and fixes:

- **Container immediately exits**: Ensure `CMD` and `ENTRYPOINT` are correctly defined. Use `tty: true` and `stdin_open: true` in Compose for interactive shells.

- **File changes not reflected**: Double-check volume mounting syntax and ensure you’re not accidentally overriding with `node_modules`.

- **Permission errors**: Files created inside containers might be owned by root. Use user-specific UID/GID settings if needed.

- **App not accessible**: Ensure port mapping (`-p 3000:3000`) is correct and app is listening on `0.0.0.0`.

- **Memory issues**: Docker may throttle memory. Check Docker Desktop settings or adjust `mem_limit` in `docker-compose.yml`.

## Production Tips

- **Use `NODE_ENV=production`**: This minimizes dependencies and ensures performance optimizations.

- **Use multi-stage builds**: As shown above, separating build and run stages reduces image size.

- **Don’t mount volumes**: In production, avoid `volumes:` to ensure a read-only, consistent image.

- **Use a process manager**: If needed, consider using `pm2` or `tini` (as shown) to manage signals and child processes.

- **Enable health checks**: Add a `healthcheck` directive to ensure your container is running correctly.

- **Security**: Scan images for vulnerabilities with tools like `docker scan` or `Trivy`.

## Additional Resources

If you’re just getting started with Docker and prefer visual learning, this video is a great introduction:

[Docker Crash Course for Absolute Beginners](https://www.youtube.com/watch?v=pg19Z8LL06w)

Prefer reading documentation? The official Docker docs are comprehensive and beginner-friendly: [Official Docker Documentation](https://docs.docker.com/)

## Final Thoughts

Docker is a game changer for consistent, scalable development. This guide shows how to Dockerize a Next.js app from start to finish. Once set up, your dev and production workflows become more reliable and repeatable.

Get started today and level up your Next.js workflow with Docker! 🐳



