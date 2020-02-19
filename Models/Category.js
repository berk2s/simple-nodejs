const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategoryModel = new Schema({
    category_id: mongoose.Types.ObjectId,
    category_name:{
        type:String
    },
    category_image:{
        type:String
    },
    branch_id:{
        type:Number
    },
    status:{
        type:Boolean,
        default:true
    }
});

module.exports = mongoose.model('Category', CategoryModel);
