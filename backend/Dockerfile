FROM node:20
WORKDIR /app/zevonecommerce/backend
COPY ./package*.json ./
RUN npm install
COPY . .
EXPOSE 8003
CMD [ "npm", "run", "start" ]