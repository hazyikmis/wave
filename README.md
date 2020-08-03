## wave

You can access the app via: https://azy-waves-app.herokuapp.com/

- You need to change ".env.local" to ".env" in order to run on local. When working on local, we had used DATABASE and "DB\_..." environment variables to connect mongodb. But when deploying to HEROKU, we have added "mLab MongoDB" add-on and it provided us MONGODB_URI=mongolab-colorful-27351. So, we have changed server.js accordingly. (We have changed process.env.DATABASE to process.env.MONGODB_URI). ACTUALLY THE EXPLANATION ABOVE IS NOT COMPLETELY CORRECT. WE DO NOT NEED TO DEFINE TWO DIFFERENT .env FILES. IN .env, OUR PREVIOUS CONNECTION COULD STAY, BUT ITS NAME SHOULD BE CHANGED TO "DATABASE" TO "MONGODB_URI". SINCE WE ARE NOT DEPLOYING .env TO HEROKU, THIS CONNECTION CONTINUE TO USE IN LOCALLY. IN HEROKU, AFTER ADDING "mLab MongoDB", "MONGODB_URI" CONFIG VAR AUTOMATICALLY ADDED TO HEROKU DEPLOYMENT ENVIRONMENT.

  1.Since, both the nodejs server (port: 3002) and react app server (port: 3000) runs on the same server, at first, the react app cannot find the route defined in axios.get in App.js ("/api/product/brands"). If we define the path as "http://localhost:3002"/api/product/brands" then the react app throws "Access-Control-Allow-Origin" error. In order to solve this issue, we added "proxy": "http://localhost:3002" key-value pair to the package.json of the react app.

  2.concurrently npm pack helps us to run both server and client apps concurrently. We have made some additions on server package.json:

```
"scripts": {
"server-start": "node server/server.js",
"server-start-dev": "nodemon server/server.js",
"client-start": "npm run start --prefix client",
"client-start-dev": "npm run start --prefix client",
"all-start": "concurrently \"npm run server-start\" \"npm run >client-start\"",
"all-start-dev": "concurrently \"npm run server-start-dev\" >\"npm run client-start-dev\""
}
```

- On the terminal, exec "npm run all-start-dev" command to run both server and client concurrently.
