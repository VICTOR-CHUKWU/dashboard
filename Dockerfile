FROM node:16-alpine

RUN mkdir -p /home/camelAdmin

COPY . /home/camelAdmin

WORKDIR /home/camelAdmin

RUN npm install --legacy-peer-deps

RUN npm run build

# switch to node user
USER node

CMD ["npm", "start"]
