const express = require("express"),
  app = express(),
  cors = require("cors"),
  morgan = require("morgan");
simpleSearch = require("./routes/simpleSearch");

app.use(cors());

app.use(morgan("tiny"));

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

app.use("/", simpleSearch);

app.listen(process.env.PORT || 8081, () => {
  console.log(`Example app listening on port 8081!`);
});
exports = module.exports = app;
