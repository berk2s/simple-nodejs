var express = require('express');
var router = express.Router();

// jwt
const jwt = require('jsonwebtoken');

// bcrypt
const bcrypt = require('bcryptjs');

// relevant model
const User = require('../Models/User');

//config
const {PANEL_URL} = require('../constants/config');

//cors
var cors = require("cors");

var corsOptions = {
  origin: PANEL_URL,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/detail/:user_id', async (req, res, next) => {
   try{
       const {user_id} = req.params;
       const user = await User.findOne({_id : user_id});
       res.json({
           data: user,
           status: {
               state: true,
               code: 'FU_1'
           }
       })
   }catch{
       res.json(e);
   }
});

router.put('/name', async (req, res, next) => {
    try{
        const {user_id, name_surname} = req.body;
        const user = await User.findByIdAndUpdate(user_id, {
            name_surname: name_surname
        })
        res.json({
            data: user,
            status: {
                state: true,
                code: 'UU_1'
            }
        })
    }catch(e){
        res.json(e);
    }
})

router.put('/permission/email', async (req, res, next) => {
    try{
        const {user_id, value} = req.body;
        const user = await User.findByIdAndUpdate(user_id, {
            permission_email: value
        })
        res.json({
            data: user,
            status: {
                state: true,
                code: 'UU_1'
            }
        })
    }catch(e){
        res.json(e);
    }
})

router.put('/permission/sms', async (req, res, next) => {
    try{
        const {user_id, value} = req.body;
        const user = await User.findByIdAndUpdate(user_id, {
            permission_sms: value
        })
        res.json({
            data: user,
            status: {
                state: true,
                code: 'UU_1'
            }
        })
    }catch(e){
        res.json(e);
    }
})

module.exports = router;
