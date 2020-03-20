const express = require('express');
const router = express.Router();

// relevant model
const Coupon = require('../Models/Coupon');
const Product = require('../Models/Product');

//config
const {PANEL_URL} = require('../constants/config');

//cors
var cors = require("cors");

var corsOptions = {
    origin: PANEL_URL,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

var moment = require('moment');
const momentTZ = require('moment-timezone');

router.post('/validate', async (req, res, next) => {
   try{

       const {coupon_name, user_id, total_price, products} = req.body;

       const checkValidate = await Coupon.find({coupon_name: coupon_name});


       if(checkValidate.length == 0){
           res.json({
               data:'Geçersiz kupon girdiniz',
               status: {
                   state: true,
                   code: 'VC_1'
               }
           });
           return false
       }else{
           // kupon statusu OK
           // gecerlilik suresi OK
           // daha once kullanilma durumu OK
           // kosul uyumu

           const currentTime = moment.tz(Date.now(), "Europe/Istanbul");
           const couponEndTime = moment(checkValidate[0].coupon_end);
           const diff = couponEndTime.diff(currentTime._d,'minutes');

           const coupon_status = checkValidate[0].coupon_status;

           const coupon_users = checkValidate[0].used_by;
           const indexOfUser = coupon_users.map(e => e.id).indexOf(user_id);

           const limit_min_price = checkValidate[0].limit_price;
           const limit_only_selected_items = checkValidate[0].limit_selected_items_only;

           if(diff <= 0){
               res.json({
                   data:'Kuponun kullanım süresi dolmuş',
                   status: {
                       state: true,
                       code: 'VC_1'
                   }
               });
               return false;
           }

           if(!coupon_status){
               res.json({
                   data:'Kupon aktif değildir',
                   status: {
                       state: true,
                       code: 'VC_1'
                   }
               });
               return false;
           }

           if(indexOfUser !== -1){
               res.json({
                   data:'Bu kuponu daha önce kullanmışsınız',
                   status: {
                       state: true,
                       code: 'VC_1'
                   }
               });
               return false;
           }

           if(limit_min_price.status != false){
               const minPrice = parseFloat(limit_min_price.values);

               if(parseFloat(total_price) <= minPrice){
                   res.json({
                       data:`Kupon bu sepette kullanılamaz`,
                       info:`* Bu kuponunu kullanmak için en az ${minPrice} liralık sepet olması gerekiyor`,
                       status: {
                           state: true,
                           code: 'VC_2'
                       }
                   });
                   return false;
               }
           }

           if(limit_only_selected_items.status != false){
               const items = limit_only_selected_items.values;



                   if(items.length == products.length){

                       const productPromise = products.map(e => {
                           let clearProducts_ = '';
                           let clearProducts = '';
                           return new Promise((resolve1, reject1) => {

                               if(!items.includes(e.id)){
                                   const promseMap = items.map(async e => {
                                       return new Promise((resolve, reject) => {
                                           Product.findOne({_id:e})
                                               .then((data) => {
                                                   resolve('\n- '+data.product_name+'');
                                               });
                                       });
                                   });

                                   Promise.all(promseMap)
                                       .then((data) => {
                                           clearProducts += data;
                                           return true;
                                       })
                                       .then(() => {

                                           clearProducts_ = clearProducts.substring(1, clearProducts.length);

                                           resolve1({status:false, relevantProducts: clearProducts_})
                                       });

                               }else{
                                   resolve1({status:true});
                               }

                           })
                       })

                       Promise.all(productPromise)
                           .then((data) => {
                               console.log(data)
                                if(data.map(e => e.status).includes(false)){
                                    const i = data.map(e => e.status).indexOf(false);
                                    res.json({
                                        data:`Kupon bu sepette kullanılamaz.`,
                                        info:`* Bu kuponu kullanmak için sepette sadece şu ürünler olmalı:\n${data[i].relevantProducts}`,
                                        status: {
                                            state: true,
                                            code: 'VC_2'
                                        }
                                    });
                                    return false;
                                }else{
                                    console.log('asdsad')
                                }
                           })

                   }else{
                       const promseMap = items.map(async e => {
                           return new Promise((resolve, reject) => {
                               Product.findOne({_id:e})
                                   .then((data) => {
                                       resolve('\n- '+data.product_name+'');
                                   });
                           });
                       });

                       Promise.all(promseMap)
                           .then((data) => {
                               clearProducts += data;
                               return true;
                           })
                           .then(() => {
                               clearProducts_ = clearProducts.substring(1, clearProducts.length);
                               res.json({
                                   data:`Kupon bu sepette kullanılamaz`,
                                   info:`* Bu kuponu kullanmak için sepette sadece şu ürünler olmalı: \n ${clearProducts_}`,
                                   status: {
                                       state: true,
                                       code: 'VC_2'
                                   }
                               });
                           })
                       return false;
                   }



           }


           res.json({
               data:`All is well.`,
               info:`* all is well`,
               status: {
                   state: true,
                   code: 'VC_2'
               }
           });

       }

   }catch(e){
       console.log(e)
       res.json(e);
   }
});

module.exports = router;

