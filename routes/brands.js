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



router.get("/model", (req, res, next) => {
    var lang = req.query.lang;
    var brand = req.query.brand;
    var pool = new Pool(credentials)
    query = `
        select  model, count(*) as cars, (select image from images i
            inner join `+lang+` ln on i.car_id = ln.car_id
            where brand = $1 and ln.model = t.model limit 1) from `+lang+` t
        where brand = $1
        group by brand, model
    `
    value = [brand]
    pool.query(query, value)
    .then((data) => res.json(data.rows))
    .catch((err) => next(err.stack))
    pool.end();
});


router.get("/generation", (req, res, next) => {
    var lang = req.query.lang;
    var brand = req.query.brand;
    var model = req.query.model;
    var pool = new Pool(credentials)
    query = `
    select  generation, count(*) as cars, (select image from images i
        inner join `+lang+` ln on i.car_id = ln.car_id
        where brand = $1 and ln.model = $2 and generation = t.generation limit 1) from `+lang+` t
    where brand = $1 and model = $2
    group by brand, model, generation 
    `
    value = [brand,model]
    pool.query(query, value)
    .then((data) => res.json(data.rows))
    .catch((err) => next(err.stack))
    pool.end();
});

router.get("/specific", (req, res, next) => {
    var lang = req.query.lang;
    var brand = req.query.brand;
    var model = req.query.model;
    var generation = req.query.generation;
    var pool = new Pool(credentials)
    query = `
        select *, (select image from images i
            where t.car_id = i.car_id limit 1) from `+lang+` t
        where brand = $1 and model = $2 and generation = $3
    `
    value = [brand, model, generation]
    pool.query(query, value)
    .then((data) => res.json(data.rows))
    .catch((err) => next(err.stack))
    pool.end();
});


module.exports = router;