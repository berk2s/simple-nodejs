const mongoose = require('mongoose');
// jwt
const jwt = require('jsonwebtoken');

// bcrypt
const bcrypt = require('bcryptjs');

// relevant model
const User = require('../Models/User');

module.exports = async (jwtID, postID) => {

    try{

        if(!mongoose.Types.ObjectId.isValid(postID))
            return false;

        const user_JWT = await User.findOne({phone_number: jwtID});
        const user_POST = await User.findOne({_id: postID});

        if(user_JWT == null)
            return false;

        if(user_POST == null)
            return false;

        if(!user_JWT._id.equals(user_POST._id))
            return false


        return true;

    }catch(e){
        console.log(e);
    }

}
