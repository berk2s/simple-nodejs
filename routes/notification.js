const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const fcm = require('fcm-notification');
const FCM = new fcm('./mavideniste-firebase.json');


//config
const {PANEL_URL} = require('../constants/config');

//cors
var cors = require("cors");

var corsOptions = {
    origin: PANEL_URL,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

router.post('/push', cors(corsOptions), async (req, res, next) => {
    try{
        const {tokens, title, body} = req.body;


        const tokens_ = tokens;

        const message = {
            data: {    //This is only optional, you can send any data
                score: '850',
                time: '2:45'
            },
            notification:{
                title : title,
                body : body
            },
        };

        FCM.sendToMultipleToken(message, tokens_, function(err, response) {
            if(err){
                console.log('err--', err);
            }else {
                console.log('response-----', response);
            }
        })


        res.json({status:tokens})
    }catch(e){
        res.json(e);
    }
});

module.exports = router;
