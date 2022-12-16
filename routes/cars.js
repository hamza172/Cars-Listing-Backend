const express = require("express");
const router = express.Router();
const credentials  = require("../util/postgres")
const { Pool } = require('pg')


router.get("/", (req, res, next) => {
    var lang = req.query.lang;
    var pool = new Pool(credentials)
    query = `
        select * from `+lang+`
    `
    pool.query(query)
    .then((data) => res.json(data.rows))
    .catch((err) => next(err.stack))
    pool.end();
});

router.get("/:id", (req, res, next) => {
    var lang = req.query.lang;
    var car_id = req.params.id;
    var pool = new Pool(credentials)
    query = `
        select * from `+lang+`
        where car_id = $1
    `
    value = [car_id]
    pool.query(query, value)
    .then((data) => res.json(data.rows))
    .catch((err) => next(err.stack))
    pool.end();
});



module.exports = router;