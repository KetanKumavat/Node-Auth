const express = require('express');
const app = express();
const mongoose = require('mongoose');
require("dotenv").config();
const port = (process.env.PORT) || 5000;
const authRoute = require("./routes/auth");
const profile = require("./routes/profile");

mongoose
  .connect(process.env.DB_CONNECT)
  .then(() => {
    console.log("Connected to DB!");
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((error) => {
    console.error("Error connecting to DB:", error);
  });


app.use(express.json());
app.use('/api/user', authRoute);
app.use('/api/profile', profile);