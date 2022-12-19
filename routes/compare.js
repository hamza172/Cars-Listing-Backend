const express = require("express");
const router = express.Router();
const credentials  = require("../util/postgres")
const auth = require('../middleware/authenticate')
const { Pool } = require('pg')


router.post("/", auth, (req, res, next) => {
    var car1 = req.body.car1;
    var car2 = req.body.car2;
    var pool = new Pool(credentials)
    query = `
        INSERT INTO compare (car1,car2) VALUES
        ($1, $2);
    `
    value = [car1, car2]
    pool.query(query, value)
    .then(() => res.send("Inserted"))
    .catch((err) => next(err.stack))
    pool.end();
});


router.put("/", auth, (req, res, next) => {
    var id = req.body.id;
    var car1 = req.body.car1;
    var car2 = req.body.car2;
    var pool = new Pool(credentials)
    query = `
        UPDATE films SET car1 = $1 and car2 = $2
        WHERE kind = $3;
    `
    value = [car1, car2, id]
    pool.query(query, value)
    .then(() => res.send("updated"))
    .catch((err) => next(err.stack))
    pool.end();
});



router.delete("/", auth, (req, res, next) => {
    var id = req.query.id;
    var pool = new Pool(credentials)
    query = `
        DELETE from compare where id = $1
    `
    value = [id]
    pool.query(query, value)
    .then(() => res.send("Deleted"))
    .catch((err) => next(err.stack))
    pool.end();
});



router.get("/", (req, res, next) => {
    var lang = req.query.lang;
    var pool = new Pool(credentials)
    query = `
        select * from compare c
    `
    pool.query(query)
    .then((data) => {
        data = data.rows
        data.map(async (dat, index)=>{
            var pool = new Pool(credentials)
            query = `
            select * , (select image from images i
            where t.car_id = i.car_id limit 1) from `+lang+` t
            where car_id = $1
            `
            await pool.query(query, [dat.car1])
            .then(result=>{
                item = result.rows[0]
                data[index].name1 = item.brand+ ' ' + item.model+ ' ' + item.generation+ ' ' + item.startofproduction
                data[index]['car1']= result.rows
            })
            .catch((err) => {
                next(err.stack)
            })
            query = `
            select * , (select image from images i
            where t.car_id = i.car_id limit 1) from `+lang+` t
            where car_id = $1
            `
            await pool.query(query, [dat.car2])
            .then(result=>{
                item = result.rows[0]
                data[index].name2 = item.brand+ ' ' + item.model+ ' ' + item.generation+ ' ' + item.startofproduction
                data[index]['car2']= result.rows
                res.json(data)
            })
            .catch((err) => {
                next(err.stack)
            })               
            pool.end();
        })
    })
    .catch((err) => next(err.stack))
    pool.end();
});



router.get("/:id", (req, res, next) => {
    var lang = req.query.lang;
    var id = req.params.id;
    var pool = new Pool(credentials)
    query = `
        select * from compare c
        where id = $1
    `
    pool.query(query, [id])
    .then((data) => {
        data = data.rows
        data.map(async (dat, index)=>{
            var pool = new Pool(credentials)
            query = `
            select * , (select image from images i
            where t.car_id = i.car_id limit 1) from `+lang+` t
            where car_id = $1
            `
            await pool.query(query, [dat.car1])
            .then(result=>{
                item = result.rows[0]
                data[index].name1 = item.brand+ ' ' + item.model+ ' ' + item.generation+ ' ' + item.startofproduction
                data[index]['car1']= result.rows
            })
            .catch((err) =>  {
                next(err.stack)
            })
            query = `
            select * , (select image from images i
            where t.car_id = i.car_id limit 1) from `+lang+` t
            where car_id = $1
            `
            await pool.query(query, [dat.car2])
            .then(result=>{
                item = result.rows[0]
                data[index].name2 = item.brand+ ' ' + item.model+ ' ' + item.generation+ ' ' + item.startofproduction
                data[index]['car2']= result.rows
                res.json(data)
            })
            .catch((err) =>  {
                next(err.stack)
            })
            pool.end();
        })
    })
    .catch((err) => next(err.stack))
    pool.end();
});



module.exports = router;