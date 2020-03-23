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
        default:0 // -1 = canceled, 0 = pending, 1 =preparing 2= on the way, 3= successfull
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
    order_history_pending:{
        type:Date,
    },
    order_history_prepare:{
        type:Date,
        default:null,
    },
    order_history_enroute:{
        type:Date,
        default:null
    },
    order_history_success:{
        type:Date,
        default:null
    },
    order_history_cancel:{
        type:Date,
        default:null
    },
    order_date:{
        type:Date,
        default:dateTurkey._d
    },
    branch_id:Number,
});

module.exports = mongoose.model('Orders', OrdersModel);
