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
        order by t.car_id DESC
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
        where "fuelType" = 'Electricity'
        order by t.car_id DESC
        limit 8
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
        order by t.car_id DESC
        limit 6
    `
    pool.query(query)
    .then((data) => res.json(data.rows))
    .catch((err) => next(err.stack))
    pool.end();
});


router.get("/brands", (req, res, next) => {
    var pool = new Pool(credentials)
    query = `
        select name, logo,  count(car_id) as cars from brands b
        left join en e on b.name = e.brand
        group by name, logo
        order by cars desc
        limit 12
    `
    pool.query(query)
    .then((data) => res.json(data.rows))
    .catch((err) => next(err.stack))
    pool.end();
});


router.get("/latest", (req, res, next) => {
    var lang = req.query.lang;
    var pool = new Pool(credentials)
    query = `
        select * , (select image from images i
        where t.car_id = i.car_id limit 1) from `+lang+` t
        order by addedon
        limit 8
    `
    pool.query(query)
    .then((data) => res.json(data.rows))
    .catch((err) => next(err.stack))
    pool.end();
});


router.get("/cars", (req, res, next) => {
    var lang = req.query.lang;
    var pool = new Pool(credentials)
    query = `
        select * , (select image from images i
        where t.car_id = i.car_id limit 1) from `+lang+` t
        limit 8
    `
    pool.query(query)
    .then((data) => res.json(data.rows))
    .catch((err) => next(err.stack))
    pool.end();
});




router.get("/compare", (req, res, next) => {
    var lang = req.query.lang;
    var pool = new Pool(credentials)
    query = `
        select * from compare c
        limit 4;
    `
    pool.query(query)
    .then(async (data) => {
        data = data.rows
        await Promise.all(data.map(async (dat, index)=>{
            var pool = new Pool(credentials)
            query = `
            select * , (select image from images i
            where t.car_id = i.car_id limit 1) from `+lang+` t
            where car_id = $1
            `
            await pool.query(query, [dat.car1])
            .then(async result=>{
                item = result.rows[0]
                data[index].name1 = item.brand+ ' ' + item.model+ ' ' + item.generation+ ' ' + item.startofproduction
                data[index]['car1']= result.rows
                var pool = new Pool(credentials)
                query = `
                    select * , (select image from images i
                    where t.car_id = i.car_id limit 1) from `+lang+` t
                    where car_id = $1
                `
                await pool.query(query, [dat.car2])
                .then(result=>{
                    if(result.rows.length>0){
                        item = result.rows[0]
                        data[index].name2 = item.brand+ ' ' + item.model+ ' ' + item.generation+ ' ' + item.startofproduction
                        data[index]['car2']= result.rows
                    }
                })
                .catch((err) => {
                    next(err.stack)
                })   
                pool.end();      
            })
            .catch((err) => {
                next(err.stack)
            })
                  
            pool.end();
        }))
        res.json(data)
    })
    .catch((err) => next(err.stack))
    pool.end();
});


module.exports = router;