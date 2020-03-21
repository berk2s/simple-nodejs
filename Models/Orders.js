const mongoose = require('mongoose');
require('mongoose-double')(mongoose);

const Schema = mongoose.Schema;

const moment = require('moment');
const dateTurkey = moment.tz(Date.now(), "Europe/Istanbul");

var SchemaTypes = mongoose.Schema.Types;

const OrdersModel = new Schema({
    visibility_id:{
        type:Number,
        default:Date.now()
    },

    products:{
        type:[]
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
    coupon:{
        type:{}
    },
    is_bluecurrier:{
        type:Boolean
    },
    payload_type:{
        type:Number
    },

    user_id:{
        type: mongoose.Types.ObjectId
    },
    user_address:{
        type:{}
    },


    order_date:{
        type:Date,
        default:dateTurkey._d
    },
});

module.exports = mongoose.model('Orders', OrdersModel);
