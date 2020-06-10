const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const News = require('../Models/News');

const {PANEL_URL} = require('../constants/config')

const apikeyPanelMiddleware = require('../middleware/apikeypanel')

//cors
var cors = require("cors");

var corsOptions = {
    origin: PANEL_URL,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const bothMid = require('../middleware/bothmid');

router.put('/changeimage', apikeyPanelMiddleware, async(req, res, next) => {
    try{
        const {news_id, image} = req.body;
        console.log(news_id)
        console.log(image)
        await News.updateOne({_id: news_id}, {
            news_image:image
        });
        res.json({})
    }catch(e){
        res.json(e);
    }
})

router.delete('/', apikeyPanelMiddleware, async (req, res, next) => {
    try{
        const deleteIt = await News.deleteOne({_id: req.body.news_id});
        res.json({})
    }catch(e){
        res.json(e);
    }
})

router.get('/all/:branch_id', apikeyPanelMiddleware, async(req, res, next) => {
    try{
        const {branch_id} = req.params;
        const news = await News.find({branch_id:parseInt(branch_id)});

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
})

router.get('/:branch_id',  bothMid, async(req, res, next) => {
    try{
        const {branch_id} = req.params;
        const news = await News.find({branch_id:parseInt(branch_id), news_status:true})
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

router.post('/', apikeyPanelMiddleware, async (req, res, next) => {
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
