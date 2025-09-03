# Multi-stage Dockerfile for video-call-webrtc application
# This builds both frontend and backend in a single container

# Stage 1: Build the Dart Frog backend
FROM dart:stable AS backend-build

WORKDIR /app/server

# Copy backend source
COPY server/pubspec.yaml ./

# Get dependencies
RUN dart pub get

# Install dart_frog CLI
RUN dart pub global activate dart_frog_cli

# Copy the rest of the backend code
COPY server/ ./

# Build the backend application
RUN dart pub global run dart_frog:dart_frog build

# Stage 2: Build frontend with environment-specific configuration
FROM nginx:alpine AS production

# Install curl for health checks
RUN apk add --no-cache curl

# Copy frontend files
COPY web/ /usr/share/nginx/html/

# Copy custom nginx configuration
COPY web/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built Dart backend
COPY --from=backend-build /app/server/build/server /usr/local/bin/dart-server

# Create a startup script that runs both services
RUN echo '#!/bin/sh' > /start.sh && \
    echo '# Start the Dart backend server in the background' >> /start.sh && \
    echo '/usr/local/bin/dart-server &' >> /start.sh && \
    echo '# Start nginx in the foreground' >> /start.sh && \
    echo 'nginx -g "daemon off;"' >> /start.sh && \
    chmod +x /start.sh

# Expose ports for both frontend (80) and backend (8080)
EXPOSE 80 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:80/ || exit 1

# Start both services
CMD ["/start.sh"]