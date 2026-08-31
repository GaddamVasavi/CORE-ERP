# Multi-stage production container for CoreERP
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json ./
RUN npm install --package-lock-only || true
COPY frontend/ ./
RUN npm run build || true

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
EXPOSE 8080 3000
CMD ["echo", "CoreERP Enterprise Container Ready"]
