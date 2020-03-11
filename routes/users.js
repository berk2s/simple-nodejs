var express = require('express');
var router = express.Router();

// jwt
const jwt = require('jsonwebtoken');

// bcrypt
const bcrypt = require('bcryptjs');

// relevant model
const User = require('../Models/User');
const UserAddress = require('../Models/UserAddress');

//config
const {PANEL_URL} = require('../constants/config');

//cors
var cors = require("cors");

var corsOptions = {
  origin: PANEL_URL,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

router.get('/', cors(corsOptions), async (req, res, next) => {
  try{
      const data = await User.find({});
      res.json({
          data: data,
          status: {
              state: true,
              code: 'FU_1'
          }
      })
  }catch(e){
      res.json(e);
  }
});

router.get('/detail/:user_id', async (req, res, next) => {
   try{
       const {user_id} = req.params;
       const user = await User.findOne({_id : user_id});
       res.json({
           data: user,
           status: {
               state: true,
               code: 'FU_1'
           }
       })
   }catch{
       res.json(e);
   }
});

router.put('/name', async (req, res, next) => {
    try{
        const {user_id, name_surname} = req.body;
        const user = await User.findByIdAndUpdate(user_id, {
            name_surname: name_surname
        })
        res.json({
            data: user,
            status: {
                state: true,
                code: 'UU_1'
            }
        })
    }catch(e){
        res.json(e);
    }
})

router.put('/permission/email', async (req, res, next) => {
    try{
        const {user_id, value} = req.body;
        const user = await User.findByIdAndUpdate(user_id, {
            permission_email: value
        })
        res.json({
            data: user,
            status: {
                state: true,
                code: 'UU_1'
            }
        })
    }catch(e){
        res.json(e);
    }
})

router.put('/permission/sms', async (req, res, next) => {
    try{
        const {user_id, value} = req.body;
        const user = await User.findByIdAndUpdate(user_id, {
            permission_sms: value
        })
        res.json({
            data: user,
            status: {
                state: true,
                code: 'UU_1'
            }
        })
    }catch(e){
        res.json(e);
    }
})

router.get('/address/:user_id', async (req, res , next) => {
    try{
        const {user_id} = req.params
        const address = await UserAddress.find({user_id: user_id}).sort({_id: -1});
        res.json({
            data: address,
            status: {
                state: true,
                code: 'AF_1'
            }
        })
    }catch(e){
        res.json(e);
    }
});

router.post('/address', async (req, res ,next) => {
    try{
        const {address_ltd, address_lng, user_id, address_title, address_province, address_county, address, address_direction} = req.body;
        const addAddress = new UserAddress({
            user_id:user_id,
            address_title:address_title,
            address_province:address_province,
            address_county:address_county,
            address:address,
            address_direction:address_direction,
            address_ltd:''+address_ltd,
            address_lng:''+address_lng
        });
        const save = await addAddress.save();
        const addresies = await UserAddress.find({user_id: user_id}).sort({_id: -1});
        res.json({
            data: addresies,
            status: {
                state: true,
                code: 'AC_1'
            }
        })
    }catch(e){
        res.json(e);
    }
})

router.delete('/address/:user_id/:address_id', async (req, res, next) => {
    try{
        const {user_id, address_id} = req.params;
        await UserAddress.findByIdAndDelete(address_id);
        const address = await UserAddress.find({user_id: user_id}).sort({_id: -1});
        res.json({
            data: address,
            status: {
                state: true,
                code: 'AF_1'
            }
        });
    }catch(e){
        res.json(e);
    }
})

router.put('/address' , async (req, res, next) => {
    try{
        const {id, user_id, address_title, address_province, address_county, address, address_direction} = req.body;
        const update = await UserAddress.findByIdAndUpdate(id, {
            address_title:address_title,
            address_province:address_province,
            address_county:address_county,
            address:address,
            address_direction:address_direction,
        });
        const addressUpdate = await UserAddress.find({user_id: user_id}).sort({_id: -1});
        res.json({
            data: addressUpdate,
            status: {
                state: true,
                code: 'AF_1'
            }
        });
    }catch(e){
        res.json(e);
    }
})

router.put('/token', async (req, res, next) => {
    try{
        const {token, user_id} = req.body;
        console.log('token:', token);
        console.log('userid:', user_id)
        const updateUserToken = await User.findByIdAndUpdate(user_id, {
            token:token
        });
        res.json({
            data: updateUserToken,
            status: {
                state: true,
                code: 'UU_1'
            }
        })
    }catch(e){
        res.json(e);
    }
})

module.exports = router;
