FROM node:22-alpine AS build

WORKDIR /app

COPY package.json pnpm-lock.yaml .

# cache npm and pnpm cache folders cross build
RUN --mount=type=cache,target=/root/.npm --mount=type=cache,target=/root/.local/share/pnpm/store/v10 npm i -g pnpm@10 && pnpm i --frozen-lockfile

COPY . .

RUN pnpm build

FROM node:22-alpine AS prod

WORKDIR /app

COPY package.json pnpm-lock.yaml .

RUN --mount=type=cache,target=/root/.npm --mount=type=cache,target=/root/.local/share/pnpm/store/v10 npm i -g pnpm@10 && pnpm i -P --frozen-lockfile

COPY --from=build /app/dist  ./dist

ARG PORT
EXPOSE ${PORT}

CMD ["pnpm", "start:prod"]
