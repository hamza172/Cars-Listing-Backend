const express = require("express");
const router = express.Router();
const credentials  = require("../util/postgres")
const { Pool } = require('pg')


router.get("/hotcars", (req, res, next) => {
    var lang = req.query.lang;
    var pool = new Pool(credentials)
    query = `
        select * , (select image from images i
        where t.car_id = i.car_id limit 1) from `+lang+` t
        where hotcar = True
        limit 6
    `
    pool.query(query)
    .then((data) => res.json(data.rows))
    .catch((err) => next(err.stack))
    pool.end();
});


router.get("/electric", (req, res, next) => {
    var lang = req.query.lang;
    var pool = new Pool(credentials)
    query = `
        select * , (select image from images i
        where t.car_id = i.car_id limit 1) from `+lang+` t
        where hotcar = True
        limit 8
    `
    pool.query(query)
    .then((data) => res.json(data.rows))
    .catch((err) => next(err.stack))
    pool.end();
});


module.exports = router;