var express = require('express');
var router = express.Router();

// jwt
const jwt = require('jsonwebtoken');

// bcrypt
const bcrypt = require('bcryptjs');

// relevant model
const User = require('../Models/User');
const UserAddress = require('../Models/UserAddress');

//config
const {PANEL_URL} = require('../constants/config');

//cors
var cors = require("cors");

var corsOptions = {
    origin: PANEL_URL,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

router.get('/', cors(corsOptions), async (req, res, next) => {
    try{
        const data = await User.find({});
        res.json({
            data: data,
            status: {
                state: true,
                code: 'FU_1'
            }
        })
    }catch(e){
        res.json(e);
    }
});

module.exports = router;
