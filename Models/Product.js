const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const moment = require('moment-timezone');
const dateTurkey = moment.tz(Date.now(), "Europe/Istanbul");

const ProductModel = new Schema({
    product_id: mongoose.Types.ObjectId,
    category_id: mongoose.Types.ObjectId,
    branch_id: mongoose.Types.ObjectId,
    product_brand: mongoose.Types.ObjectId,
    product_name: {
        type:String,
    },
    product_image:{
        type:String,
    },
    product_discount:{
        type:Number,
        default:null
    },
    product_unit_weight:{
        type:Number
    },
    product_unit_type:{
        type:String
    },
    product_list_price:{
        type:Number,
    },
    product_old_price:{
        type:Number,
        default:null,
    },
    product_amonut:{
        type:Number
    },
    product_date:{
        type:Date,
        default:dateTurkey._d
    },
});

module.exports = mongoose.model('Product', ProductModel);
