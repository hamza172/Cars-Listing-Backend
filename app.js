const express = require("express");
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



const PORT = process.env.PORT || 3000;


app.use(function (err, req, res, next) {
    console.error(err.message, req);
    if (!err.statusCode)
      err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
  });
  

const brandsRoute  = require('./routes/brands');
const hotCarsRoute  = require('./routes/hotCars');


app.use('/brands', brandsRoute);
app.use('/hotCars', hotCarsRoute);

app.get("/", (req, res) => { 
res.status(200).send("Welcome to backend of Cars Listing project"); 
});


app.listen(PORT, () => console.log(`Server Running at port ${PORT}`));