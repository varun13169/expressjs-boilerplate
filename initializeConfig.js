const mongoose = require('mongoose');

const mongodbUri = `mongodb+srv://${mdbUname}:${mdbPass}@${mdbCluster}.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

mongoose.connect(mongodbUri)
.then((success) => {
  console.log('Connected Successfully !!!')
})
.catch(() => {
  console.log(err)
});


// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error: "));
// db.once("open", function () {
//   console.log("Connected successfully");
// });

