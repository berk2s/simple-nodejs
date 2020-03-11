const mongoose = require('mongoose');
require('mongoose-double')(mongoose);

const Schema = mongoose.Schema;

const moment = require('moment-timezone');
const dateTurkey = moment.tz(Date.now(), "Europe/Istanbul");

var SchemaTypes = mongoose.Schema.Types;


const ProductModel = new Schema({
    category_id: mongoose.Types.ObjectId,
    branch_id: Number,
    brand_id: mongoose.Types.ObjectId,
    product_name: {
        type:String,
    },
    product_image:{
        type:String,
    },
    product_discount:{
        type:SchemaTypes.Double,
        default:null
    },
    product_discount_price:{
        type:SchemaTypes.Double,
        default:null,
    },
    product_unit_weight:{
        type:SchemaTypes.Double,
    },
    product_unit_type:{
        type:String
    },
    product_list_price:{
        type:SchemaTypes.Double,
    },

    product_amonut:{
        type:SchemaTypes.Double,
    },
    product_status:{
        type:Boolean,
        default:true
    },
    product_date:{
        type:Date,
        default:dateTurkey._d
    },
});

module.exports = mongoose.model('Product', ProductModel);
