FROM node:latest

WORKDIR /usr/src/app
COPY . .

RUN npm i
RUN npm run build

ENTRYPOINT [ "npm", "start" ]