FROM node:lts-alpine
WORKDIR /usr/src/
COPY ./package*.json ./
RUN npm ci
COPY . .
