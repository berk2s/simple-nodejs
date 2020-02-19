const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategoryModel = new Schema({
    category_id: mongoose.Types.ObjectId,
    category_name:{
        type:String
    },
    category_image:{
        type:String
    }
});

module.exports = mongoose.model('Category', CategoryModel);
