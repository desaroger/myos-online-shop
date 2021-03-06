FROM node:16-alpine
WORKDIR /usr/src
COPY ./package*.json ./
RUN npm ci
ENV PATH /usr/src/node_modules/.bin:$PATH
WORKDIR /usr/src/app
COPY . .
