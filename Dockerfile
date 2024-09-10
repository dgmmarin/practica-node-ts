FROM node:18

WORKDIR /api-test

COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]