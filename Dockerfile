# Build stage
FROM node:24-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the Nuxt application
RUN npm run build

# Production stage
FROM node:24-alpine

WORKDIR /app

# Copy the built output from the build stage
COPY --from=build /app/.output ./.output
COPY --from=build /app/package.json ./package.json

# Set environment variables
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", ".output/server/index.mjs"]
