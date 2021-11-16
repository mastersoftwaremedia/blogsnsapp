[![Heroku - View on Heroku](https://img.shields.io/badge/Heroku-View_on_Heroku-red?logo=Heroku&logoColor=white)](https://blogsnsapp.herokuapp.com/)
![NPM](https://badgen.net/npm/v/express)



# blogsnsapp
Created a MERN mini social blog media application using React.js, Node.js, and MongoDB with React Hooks, Context API, Functional React Components and more!
:rocket:


## **Project Setup**

**Server**


```
npm run server
```

```

  "scripts": {
    "start": "node server/index",
    "server": "nodemon server/index"
  },

```
**Add Credentials**

Make sure to use Git Bash if you use windows to create a .env file at the root directory of your application to hide all your sensitive information

```
touch .env
```
Add following variables to .env file:

```
NODE_ENV=PRODUCTION

FRONTEND_URL=http://localhost:3000

DB_URI=

JWT_SECRET=
JWT_EXPIRES_TIME=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY= 
CLOUDINARY_API_SECRET
```

### client

```
npm start
```

If you have any questions about the project, feel free to email me @ fortestingpurpose06@gmail.com
