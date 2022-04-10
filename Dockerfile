FROM node:14
WORKDIR /usr/clean-node-ts-api
COPY ./package.json /usr/clean-node-ts-api/
RUN npm i --only=prod
COPY ./dist ./dist
EXPOSE 5050
CMD npm start