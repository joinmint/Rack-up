const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./routes");
const errorHandler = require("./middleware/errorHandler");
const { auth } = require("express-oauth2-jwt-bearer");
const app = express();
const port = process.env.PORT || 8000;

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//registering routes in route folder
app.use("/api", routes);
//error handler middleware needs to come after routes
app.use(errorHandler);

//uptime check
app.get("/", (req, res) => {
  res.send("Up New");
});

app.listen(port, () =>
  console.log(`Hello world app listening on port ${port}!`)
);
