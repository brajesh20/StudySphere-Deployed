# Stage 1: Build Vite App
FROM node:alpine3.18 AS build

# Declare build-time environment variables
ARG REACT_APP_NODE_ENV
ARG REACT_APP_SERVER_BASE_URL
ARG VITE_FIREBASE_API_KEY
ARG VITE_API_URL

# Export them for Vite
ENV REACT_APP_NODE_ENV=$REACT_APP_NODE_ENV
ENV REACT_APP_SERVER_BASE_URL=$REACT_APP_SERVER_BASE_URL
ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY
ENV VITE_API_URL=$VITE_API_URL

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

RUN echo "Build contents:" && ls -l /app
RUN echo "Build directory:" && ls -l /app/dist

# Stage 2: Serve with Nginx
FROM nginx:1.23-alpine

WORKDIR /usr/share/nginx/html
RUN rm -rf *

COPY --from=build /app/dist .

EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
