FROM node:alpine3.18
WORKDIR /app
COPY . /app
RUN npm install
EXPOSE 7000
CMD [ "node", "gateway.js" ]
