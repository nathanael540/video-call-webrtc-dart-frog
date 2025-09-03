#!/bin/bash

# Video Call WebRTC Docker Deployment Script
# This script helps with deploying the application using Docker

set -e

echo "🎥 Video Call WebRTC - Docker Deployment"
echo "========================================"

# Function to check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        echo "❌ Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        echo "❌ Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    echo "✅ Docker and Docker Compose are available"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  compose    Build and run using docker-compose (recommended)"
    echo "  single     Build and run as a single container"
    echo "  build      Only build the images"
    echo "  stop       Stop running containers"
    echo "  clean      Remove containers and images"
    echo "  help       Show this help message"
    echo ""
}

# Function to run with docker-compose
run_compose() {
    echo "🚀 Starting with Docker Compose..."
    docker-compose up --build -d
    echo "✅ Services started successfully!"
    echo "   Frontend: http://localhost"
    echo "   Backend:  http://localhost:8080"
    echo ""
    echo "To view logs: docker-compose logs -f"
    echo "To stop: docker-compose down"
}

# Function to run single container
run_single() {
    echo "🚀 Building single container..."
    docker build -t videocall-app .
    
    echo "🚀 Starting single container..."
    docker run -d -p 80:80 -p 8080:8080 --name videocall-app videocall-app
    
    echo "✅ Container started successfully!"
    echo "   Frontend: http://localhost"
    echo "   Backend:  http://localhost:8080"
    echo ""
    echo "To view logs: docker logs -f videocall-app"
    echo "To stop: docker stop videocall-app && docker rm videocall-app"
}

# Function to build only
build_only() {
    echo "🔨 Building images..."
    docker-compose build
    docker build -t videocall-app .
    echo "✅ Images built successfully!"
}

# Function to stop containers
stop_containers() {
    echo "🛑 Stopping containers..."
    docker-compose down 2>/dev/null || true
    docker stop videocall-app 2>/dev/null || true
    docker rm videocall-app 2>/dev/null || true
    echo "✅ Containers stopped"
}

# Function to clean up
clean_up() {
    echo "🧹 Cleaning up containers and images..."
    stop_containers
    docker-compose down --rmi all 2>/dev/null || true
    docker rmi videocall-app 2>/dev/null || true
    echo "✅ Cleanup completed"
}

# Main script logic
check_docker

case "${1:-help}" in
    "compose")
        run_compose
        ;;
    "single")
        run_single
        ;;
    "build")
        build_only
        ;;
    "stop")
        stop_containers
        ;;
    "clean")
        clean_up
        ;;
    "help"|*)
        show_usage
        ;;
esac