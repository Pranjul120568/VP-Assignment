const express = require("express");
const app = express();
let port = 8000;

app.use(express.urlencoded());
app.use("/", require("./routes"));

app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running the server: ${err}`);
  }

  console.log(`Server is running on port: ${port}`);
});
