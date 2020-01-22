const express = require("express");
require("./db/mongoose");
const User = require("./db/models/user");
const Task = require("./db/models/task");
const userRoutes = require("./routers/user");
const taskRoutes = require("./routers/task");

const app = express();

app.use(express.json());


const port = process.env.PORT || 3000;

const router = new express.Router();

router.get('/test', (req, res) =>
{
  res.send('This is from our other router');
});

app.use(userRoutes);
app.use(taskRoutes);
app.use(express.json);




app.listen(port, () => {
  console.log("Server is running at " + port);
});
