docker build -t andyta/booklens .  
docker run -p 80:80 -d andyta/booklens  
docker tag andyta/booklens us.gcr.io/booklens/booklens  
docker push us.gcr.io/booklens/booklens


RUN echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
RUN echo 'Y' | sudo apt-get install apt-transport-https ca-certificates gnupg
RUN curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key --keyring /usr/share/keyrings/cloud.google.gpg add -
RUN sudo apt-get update && echo 'Y' | sudo apt-get install google-cloud-sdk
RUN echo 'Y' | sudo apt-get install google-cloud-sdk-app-engine-java
