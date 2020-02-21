FROM node:12

WORKDIR /usr/src/lifescope-app

COPY package.json ./

RUN npm install --production

COPY . .

EXPOSE 3002
CMD ["npm", "run", "start"]