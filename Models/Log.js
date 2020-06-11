const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const moment = require('moment-timezone');
const dateTurkey = moment.tz(Date.now(), "Europe/Istanbul");

const LogModel = new Schema({
    data:{
        type:{},
    },
    user_id:mongoose.Types.ObjectId,
    name_surname:String,
    created_at:{
        type:Date,
        default:dateTurkey._d
    },
});

module.exports = mongoose.model('log', LogModel);
