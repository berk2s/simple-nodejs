const mongoose = require('mongoose');
require('mongoose-double')(mongoose);
const Schema = mongoose.Schema;

var SchemaTypes = mongoose.Schema.Types;

const moment = require('moment-timezone');
const dateTurkey = moment.tz(Date.now(), "Europe/Istanbul");

const CouponModel = new Schema({
    coupon_name:{
        type:String,
        unique:true
    },
    coupon_text:{
        type:String
    },
    coupon_amount:{
        type:Number
    },
    coupon_status:{
        type:Boolean
    },
    coupon_price_type:{
        type:Number
    },
    coupon_price_unit:{
        type:SchemaTypes.Double
    },

    coupon_start:{
        type:Date
    },
    coupon_end:{
        type:Date
    },
    coupon_time:{
        type:Number
    },

    limit_price:{},
    limit_selected_items_only:{},
    limit_selected_categories_only:{},
    limit_selected_items:{},

    used_by:{
        type:[],
        default:[]
    },

    branch_id:Number,

    createdAt:{
        type:Date,
        default:dateTurkey._d
    },
});

module.exports = mongoose.model('Coupon', CouponModel);
