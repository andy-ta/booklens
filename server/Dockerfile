FROM node:10

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

RUN apt-get update && \
      apt-get -y install sudo

WORKDIR /home/node/app

COPY package*.json ./

USER root

RUN npm install

COPY --chown=node:node . .

ENV GOOGLE_APPLICATION_CREDENTIALS="/home/node/app/booklens.json"

RUN echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
RUN echo 'Y' | sudo apt-get install apt-transport-https ca-certificates gnupg
RUN curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key --keyring /usr/share/keyrings/cloud.google.gpg add -
RUN sudo apt-get update && echo 'Y' | sudo apt-get install google-cloud-sdk
RUN echo 'Y' | sudo apt-get install google-cloud-sdk-app-engine-java

EXPOSE 80
CMD [ "npm", "start" ]
