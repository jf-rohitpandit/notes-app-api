const express = require("express");
require("./database/mongoose");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

const port = process.env.PORT;

app.use(express.json());

app.use(userRoutes);
app.use(taskRoutes);

app.listen(port, () => {
  console.log("app listening at port: " + port);
});
