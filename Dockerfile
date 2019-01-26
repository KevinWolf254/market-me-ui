## STAGE 1: Build Angular app on Node ##
FROM node:8.14.1-alpine as builder

COPY . /app

WORKDIR /app

RUN npm install

RUN npm audit fix

RUN npm rebuild node-sass

RUN $(npm bin)/ng build --prod

## STAGE 2: Run nginx to serve web app ##
FROM nginx:1.15.7-alpine

COPY --from=builder /app/dist/* /usr/share/nginx/html/

COPY ./configurations/webserver-proxy-prod.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 443