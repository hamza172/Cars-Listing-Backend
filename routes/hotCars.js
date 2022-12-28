const express = require("express");
const router = express.Router();
const credentials  = require("../util/postgres")
const { Pool } = require('pg')
const auth = require('../middleware/authenticate')



router.get("/", (req, res, next) => {
    var lang = req.query.lang;
    var pool = new Pool(credentials)
    query = `
        select * , (select image from images i
        where t.car_id = i.car_id limit 1) from `+lang+` t
        where hotcar = True
        order by t.car_id DESC
    `
    pool.query(query)
    .then((data) => res.json(data.rows))
    .catch((err) => next(err.stack))
    pool.end();
});



router.put("/set", auth, (req, res, next) => {
    var car_id = req.query.car_id;
    var pool = new Pool(credentials)
    let languages = ['en','fr','es','ru','de','it','gr','tr','ro','fi','se','no','pl']
    for (let i=0;i<languages.length;i++){
        query = `
            UPDATE `+languages[i]+`
            SET hotcar = True
            where car_id = $1
        `
        pool.query(query, [car_id])
        .catch((err) => next(err.stack))
    }
    res.send("Updated")
    pool.end();
});


router.put("/unset", auth, (req, res, next) => {
    var car_id = req.query.car_id;
    var pool = new Pool(credentials)
    let languages = ['en','fr','es','ru','de','it','gr','tr','ro','fi','se','no','pl']
    for (let i=0;i<languages.length;i++){
        query = `
            UPDATE `+languages[i]+`
            SET hotcar = False
            where car_id = $1
        `
        pool.query(query, [car_id])
        .catch((err) => next(err.stack))
    }
    res.send("Updated")
    pool.end();
});

module.exports = router;