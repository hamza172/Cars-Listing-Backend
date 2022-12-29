const express = require("express");
const router = express.Router();
const credentials  = require("../util/postgres")
const { Pool } = require('pg');
const jwt = require("jsonwebtoken");
require("dotenv").config();



router.get("/", (req, res, next) => {
    var name = req.query.name;
    var password = req.query.password;
    var pool = new Pool(credentials)
    query = `
        select * from administration
        where name = $1 and password = $2
    `
    value = [name, password]
    pool.query(query, value)
    .then((data) => {
        if(data.rows.length!==0){
            const token = jwt.sign(
                { id: data.rows.id },
                "hamza-hamza-hamza-hamza",
                {
                  expiresIn: "2h",
                }
            );
            res.status(200).json(token);
        }
        else
            res.status(400).send("Invalid Credentials");
    })
    .catch((err) => next(err.stack))
    pool.end();
});



module.exports = router;