FROM node:16-alpine as build

WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./
COPY public ./public
COPY src ./src

RUN yarn install
RUN yarn run build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
