const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const FCM = require('../helper/fcm')

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

const {TOPIC_EVERYBODY} = require('../constants/config')

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

router.post('/subscribe', (req, res, next) => {
    const {group_name, group_users} = req.body;
    console.log(group_name.trim())
    res.json({})
})

router.post('/topic', cors(corsOptions), async (req, res, next) => {
    try{
        const {group_name, group_desc, group_branch, group_users, tokens} = req.body;
        const newGroup = new UserGroups({
            group_name:group_name,
            group_desc:group_desc,
            group_branch:group_branch,
            group_users:group_users
        });
        const saveGroup = await newGroup.save();

        console.log(group_users);

        FCM.subscribeToTopic(group_users, saveGroup._id, function(err, response) {
            if(err){
                console.log('error found', err);
            }else {
                console.log('response here', response);
            }
        });

        res.json({
            data: 'OK',
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
        const {title, body, group} = req.body;

        const topic = group;

        console.log(topic);

        const message = {
            data: {    //This is only optional, you can send any data
                score: '850',
                time: '2:45'
            },
            notification:{
                title : title,
                body : body
            },
            topic:topic.trim(),
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

router.post('/push/user', async (req, res, next) => {
    try{
        const {title, body, token} = req.body;
        console.log(token);
        var message = {
            data: {
                score: '850',
                time: '2:45'
            },
            notification:{
                title : title,
                body : body
            },
            token : token
        };

        FCM.send(message, function(err, response) {
            if(err){
                console.log('error found', err);
            }else {
                console.log('response here', response);
            }
        });

        res.json({})
    }catch(e){
        res.json(e);
    }
})

router.post('/token', async(req, res, next) => {
    try {
        const {token, platform} = req.body;

        const checkToken = Tokens.findOne({token:token});

        checkToken.then(isit => {
            if(!isit){
                FCM.unsubscribeFromTopic(token, TOPIC_EVERYBODY, function(err, response) {
                    if(err){
                        console.log('error found', err);
                    }else {
                        console.log('response here', response);
                    }
                });

                FCM.subscribeToTopic(token, TOPIC_EVERYBODY, function(err, response) {
                    if(err){
                        console.log('error found', err);
                    }else {
                        console.log('response here', response);
                    }
                });
            }

            return isit;
        }).then(async data => {
            if(!data) {
                const tokenSave = new Tokens({
                    token: token,
                    platform: platform
                });

                const saveit = await tokenSave.save();


                res.json({
                    data: saveit,
                    state: {
                        status: true,
                        code: 'IT_1'
                    }
                });
            }
        })

    }catch(e){
        res.json(e);
    }
})

module.exports = router;
