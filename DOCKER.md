# Docker Deployment Guide

This directory contains Docker configuration files for deploying the video-call-webrtc application.

## Deployment Options

### Option 1: Docker Compose (Recommended)

Use Docker Compose to run frontend and backend as separate services:

```bash
# Build and run both services
docker-compose up --build

# Run in detached mode
docker-compose up -d --build

# Stop services
docker-compose down
```

This will:
- Start the backend server on port 8080
- Start the frontend web server on port 80
- Set up networking between the services

### Option 2: Single Container

Build and run both frontend and backend in a single container:

```bash
# Build the combined image
docker build -t videocall-app .

# Run the container
docker run -p 80:80 -p 8080:8080 videocall-app
```

### Option 3: Separate Containers

Build and run containers separately:

```bash
# Build backend
cd server
docker build -t videocall-backend .

# Build frontend  
cd ../web
docker build -t videocall-frontend .

# Run backend
docker run -p 8080:8080 videocall-backend

# Run frontend (in another terminal)
docker run -p 80:80 videocall-frontend
```

## Accessing the Application

After deployment:
- **Frontend**: http://localhost (port 80)
- **Backend API**: http://localhost:8080
- **WebSocket**: ws://localhost:8080/ws

## Environment Configuration

The frontend automatically detects the environment:
- **Development**: Uses `ws://localhost:8080/ws`
- **Production**: Uses the current hostname with port 8080

## Production Deployment

For production deployment:

1. Update the WebSocket URL configuration in `web/js/main.js` if needed
2. Use a reverse proxy (nginx/Apache) to handle SSL termination
3. Consider using Docker Swarm or Kubernetes for scaling
4. Set up proper monitoring and logging

## File Structure

```
├── Dockerfile                 # Single container build
├── docker-compose.yml         # Multi-service orchestration
├── server/
│   ├── Dockerfile            # Backend container
│   └── .dockerignore
├── web/
│   ├── Dockerfile            # Frontend container
│   ├── nginx.conf            # Nginx configuration
│   └── .dockerignore
└── .dockerignore             # Root ignore file
```