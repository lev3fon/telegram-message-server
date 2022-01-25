FROM node:14

WORKDIR /usr/src/app

#Install app dependencies
COPY package*.json ./

COPY . .

RUN npm install
#RUN npx sequelize db:migrate

EXPOSE 6432

CMD [ "node", "src/bot.js" ]