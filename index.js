require('app-module-path').addPath(__dirname);

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const utils = require('lib/utils.js')

app.use(bodyParser.json()); // for parsing application/json

// Adding decoded User data here
app.use(utils.addAuthInfoToReq);

// Adding modules(routes) from route directory to application
utils.mountModulesSync(app);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})