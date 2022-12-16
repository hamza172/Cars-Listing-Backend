const express = require("express");
const router = express.Router();
const credentials  = require("../util/postgres")
const { Pool } = require('pg')


router.get("/", (req, res, next) => {
    var pool = new Pool(credentials)
    query = `
        select name, logo,  count(car_id) as cars from brands b
        left join en e on b.name = e.brand
        group by name, logo
    `
    pool.query(query)
    .then((data) => res.json(data.rows))
    .catch((err) => next(err.stack))
    pool.end();
});

router.get("/cars", (req, res, next) => {
    var lang = req.query.lang;
    var brand = req.query.brand;
    var pool = new Pool(credentials)
    query = `
        select * from `+lang+`t
        inner join images i on t.car_id = i.car_id 
        where brand = $1
    `
    value = [brand]
    pool.query(query, value)
    .then((data) => res.json(data.rows))
    .catch((err) => next(err.stack))
    pool.end();
});



module.exports = router;