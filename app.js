const express = require("express");
const mongoose = require("mongoose");
let bodyParser = require('body-parser');
const cors = require("cors");
require("dotenv").config(); 


const app = express();

app.use(cors({
    origin: '*'
  }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database connection Success!");
  })
  .catch((err) => {
    console.error("Mongo Connection Error", err);
  });


const PORT = process.env.PORT || 3000;


app.use(function (err, req, res, next) {
    console.error(err.message, req);
    if (!err.statusCode)
      err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
  });
  

app.get("/", (req, res) => { 
res.status(200).send("Welcome to backend of Cars Listing project"); 
});