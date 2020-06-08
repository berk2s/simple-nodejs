const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const moment = require('moment-timezone');
const dateTurkey = moment.tz(Date.now(), "Europe/Istanbul");

const ShoppingList = new Schema({
    user_id:{
        type:mongoose.Types.ObjectId,
    },
    list_name:String,
    products:{
        type:[]
    },
    created_date:{
        type:Date,
        default:dateTurkey._d
    },
});

module.exports = mongoose.model('ShoppingList', ShoppingList);
