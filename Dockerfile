FROM node:16-alpine

COPY . /app
WORKDIR /app

RUN yarn install
RUN yarn build

ENTRYPOINT ["yarn", "start:prod"]
