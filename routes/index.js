var express = require('express');
var router = express.Router();

// jwt
const jwt = require('jsonwebtoken');

// bcrypt
const bcrypt = require('bcryptjs');

// relevant model
const User = require('../Models/User');

//config
const {PANEL_URL} = require('../constants/config');

//cors
var cors = require("cors");

var corsOptions = {
  origin: PANEL_URL,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('https://www.mavideniste.com');
});

router.post('/resetpass', async (req, res, next) => {
  try{
    const {user_id, password} = req.body;

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        const findUser = await User.findByIdAndUpdate(user_id, {
          password: hash
        });
        res.json({
          message: findUser,
          status: {
            state: true,
            code: 'RP_1',
          }
        });
      });
    });

  }catch(e){
    res.json({
      message: e,
      status: {
        state: true,
        code: 'R_ERROR',
      }
    });
  }
})

router.post('/checkrepass', async (req, res, next) => {
  try{
    const {phone_number} = req.body;
    const userCheck = await User.findOne({phone_number: phone_number});

    if(userCheck){
      res.json({
        data: userCheck,
        status: {
          state: true,
          code: 'RR_1',
        }
      });
    }else{
      res.json({
        data: 'Böyle bir kullanıcı yok',
        status: {
          state: true,
          code: 'RR_0',
        }
      });
    }

  }catch(e){
    res.json({
      message: e,
      status: {
        state: true,
        code: 'R_ERROR',
      }
    });
  }
})

router.post('/checkuser', async (req, res, next) => {
  try{
    const {name_surname, email_address, phone_number, password, which_platform} = req.body;
    const userCheck = await User.findOne({$or: [{email_address: email_address}, {phone_number: phone_number}]});

    if(userCheck){
      let whichOne = null;

      if(userCheck.email_address == email_address && userCheck.phone_number == phone_number)
        whichOne = 'both';
      else if(userCheck.email_address == email_address)
        whichOne = 'email';
      else
        whichOne = 'phone';

      res.json({
        message:'Böyle bir kullanıcı mevcut!',
        status:{
          state:false,
          code:'R0',
          whichOne
        }
      });
      return false;

    }else {

            res.json({
              message: 'Üye temiz!',
              status: {
                state: true,
                code: 'R1',
              }
            });
    }

  }catch(e){
    res.json(e);
  }
});

router.post('/register', async (req, res, next) => {
  try{
    const {name_surname, email_address, phone_number, password, which_platform} = req.body;
    const userCheck = await User.findOne({$or: [{email_address: email_address}, {phone_number: phone_number}]});

    if(userCheck){
      let whichOne = null;

      if(userCheck.email_address == email_address && userCheck.phone_number == phone_number)
        whichOne = 'both';
      else if(userCheck.email_address == email_address)
        whichOne = 'email';
      else
        whichOne = 'phone';

      res.json({
        message:'Böyle bir kullanıcı mevcut!',
        status:{
          state:false,
          code:'R0',
          whichOne
        }
      })

    }else {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
          const user = await new User({
            name_surname: name_surname,
            email_address: email_address,
            phone_number: phone_number,
            which_platform: which_platform,
            password: hash,
          });
          try {
            const data = await user.save();
            res.json({
              message: 'Üye başarılı şekilde eklendi!',
              status: {
                state: true,
                code: 'R1',
                user_id: data._id
              }
            });
          } catch (e) {
            res.json(e);
          }
        });
      });
    }

  }catch(e){
    res.json(e);
  }
})

router.post('/authenticate', async (req, res, next) => {
  const { phone_number, password } = req.body;

  const promise = User.findOne({phone_number});

  promise
      .then((user) => {

        if(!user){

          res.json({
            message:'Geçersiz telefon numarasi',
            status:{
              state:false,
              code:'A0'
            }
          })
          return false;
        }

        bcrypt.compare(password, user.password)
            .then((result) => {
              if(!result){

                res.json({
                  message:'Geçersiz şifre',
                  status:{
                    state:false,
                    code:'A1'
                  }
                })
                return false;
              }

              console.log('id ' + user._id)

              const payload = {phone_number:phone_number, id:user._id};

              const token = jwt.sign(payload, req.app.get('API_KEY'), {
                expiresIn: '365d'
              });


              res.json({
                message:'successful!',
                status:{
                  state:true,
                  code:'A2',
                  token,
                  user_id: user._id,
                  name_surname: user.name_surname
                }
              })

            })

      })
      .catch((err) => {
        res.json(err);
      })

})

module.exports = router;
