const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const FCM = require('../helper/fcm')

const User = require('../Models/User');
const UserGroups = require('../Models/UserGroups');
const Tokens = require('../Models/Tokens');

//config
const {PANEL_URL} = require('../constants/config');

//cors
var cors = require("cors");
const axios = require('axios')
const {SMS_API_ID, SMS_API_PASSWORD} = require('../constants/config')

var corsOptions = {
    origin: PANEL_URL,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
const apikeyPanelMiddleware = require('../middleware/apikeypanel')

const {TOPIC_EVERYBODY} = require('../constants/config')

router.get('/topic', apikeyPanelMiddleware, async(req, res, next) => {
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

router.post('/topic', apikeyPanelMiddleware, async (req, res, next) => {
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

router.post('/all/sms', apikeyPanelMiddleware, async (req,res,next) => {
    try{
        const {body, branch_id} = req.body;
        const users = await User.find({});
        users.map(async e => {
            const number = '9'+e.phone_number;

            const sendSMS = await axios.post('http://api.smsala.com/api/SendSMS', {
                "api_id": SMS_API_ID,
                "api_password": SMS_API_PASSWORD,
                "sms_type": 'T',
                "encoding": 'T',
                "sender_id": 'mavideniste',
                "phonenumber": number,
                "textmessage": body,
            });

        })

        res.json({})
    }catch(e){
        res.json(e);
    }
})

router.post('/sms', apikeyPanelMiddleware, async (req,res,next) => {
    try{
        const {body, branch_id} = req.body;
        const users = await User.find({user_branch: parseInt(branch_id)});
        users.map(async e => {
            const number = '9'+e.phone_number;

            const sendSMS = await axios.post('http://api.smsala.com/api/SendSMS', {
                "api_id": SMS_API_ID,
                "api_password": SMS_API_PASSWORD,
                "sms_type": 'T',
                "encoding": 'T',
                "sender_id": 'mavideniste',
                "phonenumber": number,
                "textmessage": body,
            });

        })

        res.json({})
    }catch(e){
        res.json(e);
    }
})

router.post('/sms/user', apikeyPanelMiddleware, async (req,res,next) => {
    try{
        const {body, phone_number} = req.body;

        console.log(body)
        console.log(phone_number)

            const sendSMS = await axios.post('http://api.smsala.com/api/SendSMS', {
                "api_id": SMS_API_ID,
                "api_password": SMS_API_PASSWORD,
                "sms_type": 'T',
                "encoding": 'T',
                "sender_id": 'mavideniste',
                "phonenumber": phone_number,
                "textmessage": body,
            });

        res.json({})
    }catch(e){
        res.json(e);
    }
})

router.post('/all/push', apikeyPanelMiddleware,  async (req, res, next) => {
    try{
        const {title, body, group, branch_id} = req.body;

        const topic = group;


        const users = await User.find({});
        users.map(e => {
            const token = e.token;

            if(token != null){
                var message = {
                    data: {
                        score: '850',
                        time: '2:45',
                        title:title,
                        body:body,
                    },
                    notification:{
                        title : title,
                        body : body,
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
            }
        })


        res.json({status:tokens})
    }catch(e){
        res.json(e);
    }
});

router.post('/push',  apikeyPanelMiddleware, async (req, res, next) => {
    try{
        const {title, body, group, branch_id} = req.body;

        const topic = group;


        const users = await User.find({user_branch: parseInt(branch_id)});
        users.map(e => {
            const token = e.token;

            if(token != null){
                var message = {
                    data: {
                        score: '850',
                        time: '2:45',
                        title:title,
                        body:body,
                    },
                    notification:{
                        title : title,
                        body : body,
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
            }
        })


        res.json({status:tokens})
    }catch(e){
        res.json(e);
    }
});

router.post('/push/user', apikeyPanelMiddleware, async (req, res, next) => {
    try{
        const {title, body, token} = req.body;
        console.log(token);
        var message = {
            data: {
                score: '850',
                time: '2:45',
                title:title,
                body:body,
            },
            notification:{
                title : title,
                body : body,
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

router.post('/token', apikeyPanelMiddleware, async(req, res, next) => {
    try {
        const {token, platform} = req.body;

        const checkToken = await Tokens.find({token:token});

        if(checkToken.length == 0){
            FCM.subscribeToTopic(token, TOPIC_EVERYBODY, function(err, response) {
                if(err){
                    console.log('error found', err);
                }else {
                    console.log('response here', response);
                }
            });

            const tokenSave = new Tokens({
                token: token,
                platform: platform
            });

            const saveit = await tokenSave.save();


            console.log('e')
            res.json({
                data: saveit,
                state: {
                    status: true,
                    code: 'IT_1'
                }
            });
        }else{
            console.log('asdsad')
            res.json({
                data: 'saveit',
                state: {
                    status: true,
                    code: 'IT_1'
                }
            });
        }



    }catch(e){
        console.log('e2')
        console.log(e)
        res.json(e);
    }
})

module.exports = router;
