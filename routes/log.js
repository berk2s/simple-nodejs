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
