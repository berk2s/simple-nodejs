const express = require('express');
const router = express.Router();
const axios = require('axios')
const {SMS_API_ID, SMS_API_PASSWORD} = require('../constants/config')

const KeyModel = require('../Models/VerifactionUniqueKeys')
var schedule = require('node-schedule');

router.post('/repass', async(req, res, next) => {
    try{

        const {phone_number, unique_key} = req.body;


        const keyCheck = await KeyModel.findOne({type:2, $or: [{key: unique_key}, {phone_number: phone_number}]});

        if(keyCheck){
            res.json({
                data:keyCheck,
                is_send:true,
                status: {
                    state: true,
                    code: 'SV_1'
                }
            });
            console.log('here')
            return false;
        }else {

            const code = Math.floor(Math.random() * 1000000);

            let textmessage = `Eğer şifre sıfırlama talebinde bulunmadıysanız dikkate almayın. Doğrulama kodu: ${code}`

            const sendSMS = await axios.post('http://api.smsala.com/api/SendSMS', {
                "api_id": SMS_API_ID,
                "api_password": SMS_API_PASSWORD,
                "sms_type": 'T',
                "encoding": 'T',
                "sender_id": 'mavideniste',
                "phonenumber": phone_number,
                "textmessage": textmessage,
            });

            console.log(sendSMS)
            console.log('here2')

            const keyToDB = new KeyModel({
                key: unique_key,
                code: code,
                phone_number:phone_number,
                type:2,
            });
            const saveKey = await keyToDB.save();


            let startTime = new Date(Date.now() + 120000);
            let endTime = new Date(startTime.getTime() + 5000);
            const nowTime = ''+Date.now()
            var j = schedule.scheduleJob(nowTime, { start: startTime, end: endTime, rule: '*/1 * * * * *' }, async function(){
                const key_id = saveKey._id;
                await KeyModel.findByIdAndDelete(key_id);
                console.log('silindi ' + phone_number)
                schedule.cancelJob(nowTime);
            });


            res.json({
                data: saveKey,
                is_send:false,
                status: {
                    state: true,
                    code: 'SV_1'
                }
            })
        }

    } catch(e){
        console.log(e);
        res.json({
            data: e,
            is_send:false,
            status: {
                state: true,
                code: 'SV_2'
            }
        });
    }
});


router.post('/newuser', async(req, res, next) => {
   try{

       const {phone_number, unique_key} = req.body;
       const code = Math.floor(Math.random() * 1000000);

       let textmessage = `Mavidenİste'ye hoşgeldiniz. İyi alışverişler dileriz. Doğrulama kodunuz: ${code}`

       const keyToDB = new KeyModel({
           key: unique_key,
           code: code,
           phone_number:phone_number,
           type:1,
       });

       const keyCheck = await KeyModel.findOne({type:1, $or: [{key: unique_key}, {phone_number: phone_number}]});

       if(keyCheck){
           res.json({
               data:keyCheck,
               is_send:true,
               status: {
                   state: true,
                   code: 'SV_1'
               }
           });
           return false;
       }else {

           const saveKey = await keyToDB.save();

           const sendSMS = await axios.post('http://api.smsala.com/api/SendSMS', {
               "api_id": SMS_API_ID,
               "api_password": SMS_API_PASSWORD,
               "sms_type": 'T',
               "encoding": 'T',
               "sender_id": 'mavideniste',
               "phonenumber": phone_number,
               "textmessage": textmessage,
           });



           let startTime = new Date(Date.now() + 120000);
           let endTime = new Date(startTime.getTime() + 5000);
           const nowTime = ''+Date.now()
           var j = schedule.scheduleJob(nowTime, { start: startTime, end: endTime, rule: '*/1 * * * * *' }, async function(){
               const key_id = saveKey._id;
               await KeyModel.findByIdAndDelete(key_id);
               console.log('silindi ' + phone_number)
               schedule.cancelJob(nowTime);
           });


           res.json({
               data: saveKey,
               is_send:false,
               status: {
                   state: true,
                   code: 'SV_1'
               }
           })
       }

   } catch(e){
       console.log(e);
       res.json({
           data: e,
           is_send:false,
           status: {
               state: true,
               code: 'SV_2'
           }
       });
   }
});


module.exports = router;
