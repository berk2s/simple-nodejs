const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserAddress = new Schema({
   user_id: mongoose.Types.ObjectId,
    address_title:{
       type:String,
    },
    address_province:{
       type:Number,
    },
    address_county:{
       type:Number,
    },
    address_district:{
       type:Number,
    },
    address:{
       type:String,
    },
    address_direction:{
       type:String
    }
});

module.exports = mongoose.model('UserAddress', UserAddress);
