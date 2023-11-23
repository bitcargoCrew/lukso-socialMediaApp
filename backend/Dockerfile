# pull official base image
FROM node:18.18.2-alpine3.18

RUN apk add git openssl1.1-compat

ADD . /todo
WORKDIR /todo

RUN rm /todo/src/fund.db || echo "db not existed"

RUN npm install

CMD ["npm", "start"]