const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const moment = require('moment-timezone');
const dateTurkey = moment.tz(Date.now(), "Europe/Istanbul");

const TokenModel = new Schema({
    token:{
        type:String,
        unique:true
    },
    platform:String,
    token_date:{
        type:Date,
        default:dateTurkey._d
    },
});

module.exports = mongoose.model('tokens', TokenModel);
