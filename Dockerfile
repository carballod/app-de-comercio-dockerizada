FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build && ls -la dist/

EXPOSE 3000

COPY start.sh start.sh
RUN chmod +x start.sh
CMD [".start.sh"]