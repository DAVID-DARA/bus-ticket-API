FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

ARG PORT=3000
EXPOSE ${PORT}

CMD ["npm", "start"]
