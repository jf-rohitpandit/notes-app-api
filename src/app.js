const express = require("express");
require("./database/mongoose");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();


app.use(express.json());

app.use(userRoutes);
app.use(taskRoutes);

module.exports = app;

