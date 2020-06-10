const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const moment = require('moment-timezone');
const dateTurkey = moment.tz(Date.now(), "Europe/Istanbul");

const LogRuntimeModel = new Schema({
    data:String,
    path:String,
    created_at:{
        type:Date,
        default:dateTurkey._d
    },
});

module.exports = mongoose.model('logruntime', LogRuntimeModel);
