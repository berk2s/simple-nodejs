const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategoryModel = new Schema({
    category_id: mongoose.Types.ObjectId,
    category_name:{
        type:String
    },
    category_image:{
        type:String,
        default:null
    },
    branch_id:{
        type:Number
    },
    status:{
        type:Boolean,
        default:true
    },
    created_at:{
        type:Date,
    }
});

module.exports = mongoose.model('Category', CategoryModel);
