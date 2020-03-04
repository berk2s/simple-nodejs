const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserAddress = new Schema({
   user_id: mongoose.Types.ObjectId,
    address_title:{
       type:String,
    },
    address_province:{
       type:{},
    },
    address_county:{
       type:{},
    },
    address:{
       type:String,
    },
    address_direction:{
       type:String
    },
    address_ltd:{
       type:String
    },
    address_lng:{
       type:String
    }
});

module.exports = mongoose.model('UserAddress', UserAddress);
