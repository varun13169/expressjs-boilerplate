const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')


app.use(bodyParser.json()); // for parsing application/json

const authRoute = require('./auth/authRoute.js');
const signUpRoute = require('./auth/signUp.js');
const loginRoute = require('./auth/login.js');
const uspRoute = require('./auth/userSpecificRes.js');

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



app.use(authRoute)

app.use('/', signUpRoute)
app.use('/', loginRoute)
app.use('/', uspRoute)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})