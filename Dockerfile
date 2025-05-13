FROM node:22-alpine AS build

WORKDIR /app

COPY package.json pnpm-lock.yaml .

RUN npm i -g pnpm@10 && pnpm i --frozen-lockfile

COPY . .

RUN pnpm build

FROM node:22-alpine AS prod

WORKDIR /app

COPY package.json pnpm-lock.yaml .

RUN npm i -g pnpm@10 && pnpm i -P --frozen-lockfile

COPY --from=build /app/dist  ./dist

ARG PORT
EXPOSE ${PORT}

CMD ["pnpm", "start:prod"]
