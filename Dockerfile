# base node image
FROM node:20-bullseye-slim AS base

RUN apt-get update && apt-get install -y dumb-init

RUN mkdir /usr/src/app
WORKDIR /usr/src/app

ADD package.json pnpm-lock.yaml .npmrc ./

RUN npm i -g pnpm@9 --loglevel notice --force
RUN pnpm install --prod

COPY src ./src
COPY dist ./dist
COPY LICENSE ./
COPY tsconfig.json ./

CMD ["dumb-init", "pnpm", "start"]
