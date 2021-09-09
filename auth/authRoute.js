var express = require('express')
var router = express.Router()

router.use((req, res, next) => {
  console.log("route1");
  next();
})

router.use((req, res, next) => {
  console.log("route2");
  next();
})


module.exports = router;