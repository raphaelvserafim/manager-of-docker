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