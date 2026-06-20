# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json ./
RUN npm install --no-audit --no-fund
COPY . .
ARG VITE_API_BASE_URL=/api/v1
ARG VITE_API_ROOT=
ARG VITE_ENABLE_WEBSOCKET=false
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_API_ROOT=$VITE_API_ROOT
ENV VITE_ENABLE_WEBSOCKET=$VITE_ENABLE_WEBSOCKET
RUN npm run build

# ---- Serve stage ----
FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
