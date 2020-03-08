const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const fcm = require('fcm-notification');
const FCM = new fcm('./mavideniste-firebase.json');

const UserGroups = require('../Models/UserGroups');
const Tokens = require('../Models/Tokens');

//config
const {PANEL_URL} = require('../constants/config');

//cors
var cors = require("cors");

var corsOptions = {
    origin: PANEL_URL,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

router.get('/topic', cors(corsOptions), async(req, res, next) => {
    try{

        const groups = await UserGroups.find();

        res.json({
            data: groups,
            state:{
                status:true,
                code:'FG_1'
            }
        });

    }catch(e){
        res.json(e);
    }
});

router.post('/topic', cors(corsOptions), async (req, res, next) => {
    try{
        const {group_name, group_desc, group_branch, group_users} = req.body;
        const newGroup = new UserGroups({
            group_name:group_name,
            group_desc:group_desc,
            group_branch:group_branch,
            group_users:group_users
        });
        const saveGroup = await newGroup.save();

        /*const {tokens} = req.body;

        FCM.subscribeToTopic(tokens, group_name, function(err, response) {
            if(err){
                console.log('error found', err);
            }else {
                console.log('response here', response);
            }
        })*/

        res.json({
            data: saveGroup,
            state:{
                status:true,
                code:'IG_1'
            }
        });
    }catch(e){
        res.json(e);
    }
})

router.post('/push',  async (req, res, next) => {
    try{
        const {tokens, title, body} = req.body;

        const tokens_ = tokens;

        const topic = '_Everybody_';

        const message = {
            data: {    //This is only optional, you can send any data
                score: '850',
                time: '2:45'
            },
            notification:{
                title : title,
                body : body
            },
            topic:topic
        };

        FCM.send(message, function(err, response) {
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

router.post('/token', async(req, res, next) => {
    try {
        const {token, platform} = req.body;

        const tokenSave = new Tokens({
            token:token,
            platform:platform
        });

        const saveit = await tokenSave.save();

        res.json({
            data: saveit,
            state:{
                status:true,
                code:'IT_1'
            }
        });
    }catch(e){
        res.json(e);
    }
})

module.exports = router;
