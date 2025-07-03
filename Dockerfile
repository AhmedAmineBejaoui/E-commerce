FROM node:22.13.1

WORKDIR /usr/app

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev"]