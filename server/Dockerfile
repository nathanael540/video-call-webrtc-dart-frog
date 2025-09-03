# Use the official Dart runtime as the base image
FROM dart:stable AS build

# Set the working directory in the container
WORKDIR /app

# Copy pubspec files first for better caching
COPY pubspec.yaml ./

# Get dependencies
RUN dart pub get

# Copy the rest of the application code
COPY . .

# Install dart_frog CLI
RUN dart pub global activate dart_frog_cli

# Build the application
RUN dart pub global run dart_frog:dart_frog build

# Production stage
FROM dart:stable-runtime

# Set the working directory
WORKDIR /app

# Copy the built application from the build stage
COPY --from=build /app/build .

# Expose the port the app runs on
EXPOSE 8080

# Run the application
CMD ["./server"]