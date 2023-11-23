# pull official base image
FROM node:18.18.2-alpine3.18

RUN apk add git

ADD . /todo
WORKDIR /todo

RUN npm install

CMD ["npm", "start"]