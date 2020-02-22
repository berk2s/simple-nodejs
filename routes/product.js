const express = require('express');
const router = express.Router();

// relevant model
const Product = require('../Models/Product');

//config
const {PANEL_URL} = require('../constants/config');

//cors
var cors = require("cors");

var corsOptions = {
    origin: PANEL_URL,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}


module.exports = router;
