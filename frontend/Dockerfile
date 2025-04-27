FROM node:20
WORKDIR /app/zevonecommerce/frontend
COPY ./package*.json ./
RUN npm install
COPY . .
EXPOSE 3003
CMD ["npm", "run", "start"]