const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NewsModel = new Schema({
    news_name:String,
    news_image:String,
    news_status:{
        type:Boolean,
        default:true
    },
    branch_id:Number,
    news_date:{
        type:Date
    }
});

module.exports = mongoose.model('News', NewsModel);
