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
