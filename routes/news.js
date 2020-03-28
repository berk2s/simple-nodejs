const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const News = require('../Models/News');

const {PANEL_URL} = require('../constants/config')

//cors
var cors = require("cors");

var corsOptions = {
    origin: PANEL_URL,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

router.get('/:branch_id',  async(req, res, next) => {
    try{
        const {branch_id} = req.params;
        const news = await News.find({branch_id:parseInt(branch_id)})
            .sort({_id: -1})
            .limit(10);

        res.json({
            data: news,
            status:{
                code:'FN_1',
                state:true
            }
        });

    }catch(e){
        res.json({
            data: e,
            status:{
                code:'EE_1',
                state:true
            }
        });
    }
});

router.post('/', cors(corsOptions), async (req, res, next) => {
    try{
        const {news_name, news_image, branch_id} = req.body;

        const moment = require('moment');
        const dateTurkey = moment.tz(Date.now(), "Europe/Istanbul");

        const newNews = new News({
            news_name:news_name,
            news_image: news_image,
            branch_id: branch_id,
            news_date: dateTurkey._d,
        });

        const saveNew = await newNews.save();

        res.json({
            data: newNews,
            status:{
                code:'AN_1',
                state:true
            }
        });

    }catch(e){
        res.json(e);
    }
})

module.exports = router;
