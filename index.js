const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')


app.use(bodyParser.json()); // for parsing application/json


//////// Pre Processing Functions.  ////////

// Adding decoded User data here
const auth = require('./lib/Auth.js');
const _ = require('lodash');
app.use((req, res, next) => {
  if(_.has(req.headers, 'token')) {
    let decoded = auth.decodeToken(req.headers.token);
    res.locals.authUserInfo = decoded
  }
  next();
});

///////////////


//// Adding modules(routes) from route directory to application //////
const fs = require('fs');
function mountModulesSync(application) {
  let rootPath = './routes'
  let files = fs.readdirSync(rootPath);

  for (let i = 0; i < files.length; i++) {
    let filePath = rootPath + '/' + files[i];

    application.use('/', require(filePath));
  }
}

mountModulesSync(app);

/////////////////////////////////////////


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})