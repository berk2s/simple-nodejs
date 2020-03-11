const mongoose = require('mongoose');
require('mongoose-double')(mongoose);

const Schema = mongoose.Schema;

const moment = require('moment-timezone');
const dateTurkey = moment.tz(Date.now(), "Europe/Istanbul");

var SchemaTypes = mongoose.Schema.Types;

const OrdersModel = new Schema({
    visibility_id:{
        type:Number,
        default:Date.now()
    },
    user_id:{
        type: mongoose.Types.ObjectId
    },
    user_address:{
        type:{}
    },
    payload_type:{
        type:Number
    },
    products:{
        type:{}
    },
    price:{
        type:SchemaTypes.Double
    },
    order_status:{
        type:Number,
        default:0
    },
    order_note:{
        type:String
    },
    is_bluecurrier:{
        type:Boolean
    },
    order_date:{
        type:Date,
        default:dateTurkey._d
    },
});

module.exports = mongoose.model('Orders', OrdersModel);
