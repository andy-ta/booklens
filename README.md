docker build -t andyta/booklens .  
docker run -p 80:80 -d andyta/booklens  
docker tag andyta/booklens us.gcr.io/booklens/booklens  
docker push us.gcr.io/booklens/booklens
