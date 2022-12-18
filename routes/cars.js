const express = require("express");
const router = express.Router();
const credentials  = require("../util/postgres")
const { Pool } = require('pg')



router.get("/key", (req, res, next) => {
    var lang = req.query.lang;
    var key = req.query.key;
    var pool = new Pool(credentials)
    query = `
        select * , (select image from images i
        where t.car_id = i.car_id limit 1) from `+lang+` t
        where brand ~* $1
        or model ~* $1
        or startofproduction ~* $1
        or generation ~* $1
        or  "fuelType" ~* $1;
    `
    pool.query(query, [key])
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
        where "fuelType" = 'Electricity'
    `
    pool.query(query)
    .then((data) => res.json(data.rows))
    .catch((err) => next(err.stack))
    pool.end();
});


router.get("/hybrid", (req, res, next) => {
    var lang = req.query.lang;
    var pool = new Pool(credentials)
    query = `
        select * , (select image from images i
        where t.car_id = i.car_id limit 1) from `+lang+` t
        where "fuelType" = 'petrol / electricity'
    `
    pool.query(query)
    .then((data) => res.json(data.rows))
    .catch((err) => next(err.stack))
    pool.end();
});




router.get("/", (req, res, next) => {
    var lang = req.query.lang;
    var pool = new Pool(credentials)
    query = `
        select * , (select image from images i
        where t.car_id = i.car_id limit 1) from `+lang+` t
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
    var info ;
    query = `
        select * from `+lang+`
        where car_id = $1
    `
    value = [car_id]
    pool.query(query, value)
    .then((data) => {
        info = data.rows
    })
    query = `
        select image from images
        where car_id = $1
    `
    value = [car_id]
    pool.query(query, value)
    .then((data) => {
        info[0]['images'] = data.rows
        res.json(info)
    })
    .catch((err) => next(err.stack))
    pool.end();
});




module.exports = router;