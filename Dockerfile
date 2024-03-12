FROM node:latest

# Install R
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y r-base

# Install Neutron adapter
WORKDIR /usr/src/app
COPY . .

RUN npm ci
RUN npm run build

ENTRYPOINT [ "npm", "start" ]