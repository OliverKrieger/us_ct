FROM node:18-alpine as build

WORKDIR /app

COPY . ./

RUN yarn install

CMD ["yarn", "start"]
