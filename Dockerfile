# ---------- DEV ----------
FROM node:22-alpine AS dev
WORKDIR /app
COPY package*.json ./
# keep dev deps (nodemon)
RUN npm ci                      
COPY . .
# from env.local
EXPOSE 8080                  
CMD ["npm","run","dev"]

# ---------- PROD ----------
FROM node:22 AS build
WORKDIR /app
COPY package*.json ./
# installs production deps only using the lockfile
RUN npm ci --only=production
COPY . .

# Base image: Distroless Node.js 22 — super small, no shell, no npm. Only Node runtime and essential libs.
FROM gcr.io/distroless/nodejs22-debian12 AS prod
WORKDIR /app
# copies everything prepared in the build stage into the final image
COPY --from=build /app /app
# Distroless Node images already set an ENTRYPOINT to node, so your CMD provides the script to run.
# In effect it runs: node /app/src/index.js - path must be absolute
CMD ["src/app.js"]