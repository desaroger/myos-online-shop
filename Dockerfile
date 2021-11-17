FROM node:16-alpine
WORKDIR /usr/src/
COPY ./package*.json ./
RUN npm ci
COPY . .
