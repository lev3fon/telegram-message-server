FROM node:14

WORKDIR /usr/src/app

#Install app dependencies
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 6432

CMD [ "node", "src/bot.js" ]