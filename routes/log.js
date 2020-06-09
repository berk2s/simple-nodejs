const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const Log = require('../Models/Log');

const {PANEL_URL} = require('../constants/config')

//cors
var cors = require("cors");

var corsOptions = {
    origin: PANEL_URL,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

router.get('/between/:back', cors(corsOptions), async (req, res, next) => {
    try{
        const { back } = req.params;
        const moment = require('moment-timezone');
        const resultLog = [0, 0, 0, 0, 0, 0, 0];

        for(let i = 0; i<back; i++) {
            const startDate_TypeDate = new Date();
            const finishDate_TypeDate = new Date();
            startDate_TypeDate.setDate(new Date().getDate() - (i))
            startDate_TypeDate.setHours(0)
            startDate_TypeDate.setMinutes(0)
            startDate_TypeDate.setSeconds(0)
            startDate_TypeDate.setMilliseconds(0)
            finishDate_TypeDate.setDate(new Date().getDate() - (i))
            finishDate_TypeDate.setHours(23)
            finishDate_TypeDate.setMinutes(59)
            finishDate_TypeDate.setSeconds(59)
            finishDate_TypeDate.setMilliseconds(59)
            const {_d: startDate} = moment.tz(new Date(startDate_TypeDate), "Europe/Istanbul");
            const {_d: finishDate} = moment.tz(finishDate_TypeDate, "Europe/Istanbul");
            const result = await Log.find({
                created_at: {
                    $gte: startDate, // >=
                    $lte: finishDate // <=
                }
            });
            resultLog[6-i] = result.length;
        }

        res.json(resultLog);
    }catch(e){
        res.json(e);
    }
})

router.get('/today', cors(corsOptions), async (req, res, next) => {
    try{
        const moment = require('moment-timezone');
        const startDate_TypeDate = new Date();
        const finishDate_TypeDate = new Date();
        startDate_TypeDate.setDate(new Date().getDate())
        startDate_TypeDate.setHours(0)
        startDate_TypeDate.setMinutes(0)
        startDate_TypeDate.setSeconds(0)
        startDate_TypeDate.setMilliseconds(0)
        finishDate_TypeDate.setHours(23);
        finishDate_TypeDate.setMinutes(59);
        finishDate_TypeDate.setSeconds(59);
        finishDate_TypeDate.setMilliseconds(99)
        finishDate_TypeDate.setDate(new Date().getDate())
        const { _d : startDate} = moment.tz(startDate_TypeDate, "Europe/Istanbul");
        const { _d : finishDate} = moment.tz(finishDate_TypeDate, "Europe/Istanbul");

        const {user_id} = req.params;
        const result = await Log.find({
            created_at:{
                $gte:startDate,
                $lte:finishDate,
            }
        });
        res.json({
            data:result
        });
    }catch(e){
        res.json(e);
    }
});

router.get('/:user_id', cors(corsOptions), async (req, res, next) => {
    try{
        const {user_id} = req.params;
        const result = await Log.find({user_id:user_id}).sort({_id:-1});
        res.json({
            data:result
        });
    }catch(e){
        res.json(e);
    }
});

router.post('/',  async (req, res, next) => {
    try{
        const {data, name_surname, user_id} = req.body;

        const moment = require('moment');
        const dateTurkey = moment.tz(Date.now(), "Europe/Istanbul");

        const log = new Log({
            data:data,
            name_surname: name_surname,
            user_id: user_id,
            created_at: dateTurkey._d,
        });

        const logSave = await log.save();

        res.json({
            data: logSave,
            status:{
                code:'L_1',
                state:true
            }
        });

    }catch(e){
        res.json(e);
    }
})

module.exports = router;
