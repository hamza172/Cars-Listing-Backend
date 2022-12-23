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



router.delete("/", (req, res, next) => {
    var car_id = req.query.car_id;
    var pool = new Pool(credentials)
    let languages = ['en','fr','es','ru','de','it','gr','tr','ro','fi','se','no','pl']
    for (let i=0;i<languages.length;i++){
        query = `
            DELETE from `+languages[i]+` where car_id = $1
        `
        pool.query(query, [car_id])
        .catch((err) => next(err.stack))
    }
    res.send("Deleted")
    pool.end();
});

router.get("/:id",(req, res, next) => {
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
        var pool = new Pool(credentials)
        query = `
            select image from images
            where car_id = $1
        `
        value = [car_id]
        pool.query(query, value)
        .then((data) => {
            if(info!==undefined){
                info[0]['images'] = data.rows
            }
            res.json(info)
        })
        pool.end();
    })
    .catch((err) => next(err.stack))
    pool.end();
});




module.exports = router;