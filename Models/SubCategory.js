const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubCategoryModel = new Schema({
   sub_category_name:String,
    category_id:mongoose.Types.ObjectId,
   branch_id:Number,
});

module.exports = mongoose.model('SubCategory', SubCategoryModel);
