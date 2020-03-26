const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const moment = require('moment');
const dateTurkey = moment.tz(Date.now(), "Europe/Istanbul");

const CampaignSchema = new Schema({
    campaign_name:String,
    campaign_short_desc:String,
    campaign_type:Number,
    campaign_desc:String,
    campaign_image:String,
    status:{
        type:Boolean,
        default:true
    },
    campaign_date:{
        type:Date,
        default:dateTurkey._d
    }
});

module.exports = mongoose.model('Campaign', CampaignSchema);
