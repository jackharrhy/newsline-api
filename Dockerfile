FROM node:14

WORKDIR /app

COPY ./package*.json ./

RUN npm install

COPY ./ts*.json ./
COPY ./src ./src

RUN mkdir ./fetch-cache && mkdir ./data

CMD ["npm", "run", "start"]
