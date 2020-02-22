const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const moment = require('moment-timezone');
const dateTurkey = moment.tz(Date.now(), "Europe/Istanbul");

const BrandModel = new Schema({
    brand_id: mongoose.Types.ObjectId,
    branch_id: {
        type:Number
    },
    brand_name: {
        type: String
    },
    brand_date:{
        type:Date,
        default:dateTurkey._d
    },
});

module.exports = mongoose.model('Brand', BrandModel);
