FROM node:16-alpine AS BUILD_IMAGE

ENV NODE_ENV production
WORKDIR /app

COPY ./.yarn/ /app/.yarn/
COPY ./.yarnrc.yml /app/
COPY ./package.json /app/
COPY ./yarn.lock /app/
RUN yarn install

COPY . /app
RUN yarn build
RUN yarn workspaces focus --production

FROM node:16-alpine

WORKDIR /app

COPY --from=BUILD_IMAGE /app/dist ./dist
COPY --from=BUILD_IMAGE /app/node_modules ./node_modules
COPY --from=BUILD_IMAGE /app/package.json ./package.json

EXPOSE 80 443
ENTRYPOINT ["node", "./dist/main.js"]
