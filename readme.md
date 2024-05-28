### START 

#### npm
```npm
npm install 
npm run build  
```
#### pm2
```sh
pm2 startup
pm2 start npm --name manager-of-docker  -- run "start" 
pm2 save
```

#### .env
```s
ADMIN_KEY="1234"
IMAGE_NAME="wame"
PORT=3002
```

#### Routes

```js
GET/v2/ADMIN_KEY/list //list containers
GET/v2/ADMIN_KEY/key/run //create a container
GET/v2/ADMIN_KEY/key/start //start a container
GET/v2/ADMIN_KEY/key/stop //stop a container
GET/v2/ADMIN_KEY/key/delete //delete a container
```


```sh
docker build -t name  /path
docker stop $(docker ps -q)  
docker start $(docker ps -a -q)

docker rm $(docker ps -a -q)
docker rmi

```