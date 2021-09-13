require('app-module-path').addPath(__dirname);

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const utils = require('lib/utils.js')
const initConfig = require('./initializeConfig.js')

app.use(bodyParser.json()); // for parsing application/json

// Adding decoded User data here
app.use(utils.addAuthInfoToReq);

// Adding modules(routes) from route directory to application
utils.mountModulesSync('routes' ,(filePath) => {
  app.use('/', require(filePath));
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// for custom error handler middeware
app.use((err, req, res, next) => {
  next(err);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})