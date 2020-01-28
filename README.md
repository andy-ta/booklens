## DEPLOY
docker build -t andyta/booklens .  
docker run -p 80:80 -d andyta/booklens  
docker tag andyta/booklens us.gcr.io/booklens-266214/booklens  
docker push us.gcr.io/booklens-266214/booklens


RUN echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
RUN echo 'Y' | sudo apt-get install apt-transport-https ca-certificates gnupg
RUN curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key --keyring /usr/share/keyrings/cloud.google.gpg add -
RUN sudo apt-get update && echo 'Y' | sudo apt-get install google-cloud-sdk
RUN echo 'Y' | sudo apt-get install google-cloud-sdk-app-engine-java

## API
##### POST
###### create page obj, and return a page obj
1. /api/pages
```
body:
{
    image: <ImageFile>
}
```
##### GET
###### get page obj 
1. /api/pages/:id
###### get page/sentence/word translation, lang = lang code ex. en-us 
2. /api/translate/:type/:id?target=${lang} 
###### get images of a word 
3. /api/words/:word/images
###### get image of a page
4. /api/pages/:id/image
###### get page
5. /api/pages/:id
