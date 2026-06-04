FROM node:26-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install -g npm@9.8.1 && npm config set registry https://registry.npmjs.org/ && npm install --no-package-lock

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]
