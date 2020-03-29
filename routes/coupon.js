const express = require('express');
const router = express.Router();

// relevant model
const Coupon = require('../Models/Coupon');
const Product = require('../Models/Product');
const Category = require('../Models/Category');

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

       const {coupon_name, user_id, total_price, products, branch_id} = req.body;

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
           // kupon adeti OK
           // kupon statusu OK
           // gecerlilik suresi OK
           // daha once kullanilma durumu OK
           // kosul uyumu OK
           // branch id OK
           // azalt OK

           const currentTime = moment.tz(Date.now(), "Europe/Istanbul");
           const couponEndTime = moment(checkValidate[0].coupon_end);
           const diff = couponEndTime.diff(currentTime._d,'minutes');

           const coupon_status = checkValidate[0].coupon_status;

           const coupon_branch_id = checkValidate[0].branch_id;

           const coupon_users = checkValidate[0].used_by;
           const indexOfUser = coupon_users.map(e => e.id).indexOf(user_id);

           const limit_min_price = checkValidate[0].limit_price;
           const limit_only_selected_items = checkValidate[0].limit_selected_items_only;
           const limit_selected_categories = checkValidate[0].limit_selected_categories_only;
           const limit_selected_items = checkValidate[0].limit_selected_items;

           const coupon_price_type = checkValidate[0].coupon_price_type;
           const coupon_price_unit = checkValidate[0].coupon_price_unit;

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

           if(parseInt(coupon_branch_id) != parseInt(branch_id)){
               res.json({
                   data:`Bu kupon seçili bayide kullanılamaz`,
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

           if(checkValidate[0].coupon_amount != 0){
               if(coupon_users.length >= checkValidate[0].coupon_amount){
                   res.json({
                       data:'Bu kupon tükenmiştir',
                       status: {
                           state: true,
                           code: 'VC_1'
                       }
                   });
                   return false;
               }
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
                       let clearProducts_ = '';
                       let clearProducts = '';
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
                                   info:`* Bu kuponu kullanmak için sepette sadece şu ürünler olmalı:\n${clearProducts_}`,
                                   status: {
                                       state: true,
                                       code: 'VC_2'
                                   }
                               });
                           })
                       return false;
                   }



           }

           if(limit_selected_categories.status != false){
               const items = limit_selected_categories.values;

               const categoryPromise = products.map(e => {
                   return new Promise((resolve, reject) => {
                        if(!items.includes(e.product_category)){
                            resolve(false);
                        }else{
                            resolve(true);
                        }
                   });
               });

               const dataCategory = await Promise.all(categoryPromise);

               if(dataCategory.includes(false)){

                   const itemInfos = items.map(e => {
                      return new Promise(((resolve, reject) => {
                          Category.findOne({_id:e})
                              .then((data) => {
                                  resolve('\n-'+data.category_name);
                              })
                      }));
                   });

                   const getInfos = await Promise.all(itemInfos);
                   console.log(getInfos)

                   res.json({
                       data:`Kupon bu sepette kullanılamaz.`,
                       info:`* Bu kupon sadece şu kategori ürünlerinin olduğu sepetlerde geçerlidir: ${getInfos}`,
                       status: {
                           state: true,
                           code: 'VC_2'
                       }
                   });
                   return false
               }else{
                   // no problem
               }

           }

           if(limit_selected_items.status != false){
               const items = limit_selected_items.values;

               const productPromise = products.map(e => {
                   return new Promise(((resolve, reject) => {
                       if(items.includes(e.id)){
                           resolve(true)
                       }else{
                           resolve(false);
                       }
                   }));
               });

               const dataPromise = await Promise.all(productPromise);

               if(!dataPromise.includes(true)){

                   const productInfos = items.map(e => {
                       return new Promise(((resolve, reject) => {
                           Product
                               .findOne({_id:e})
                               .then((data) => {
                                  resolve('\n-'+data.product_name);
                               });
                       }))
                   });

                   const productsText = await Promise.all(productInfos);

                   res.json({
                       data:`Kupon bu sepette kullanılamaz.`,
                       info:`* Bu kupon için sepette şu ürünlerden birileri olmalı: ${productsText}`,
                       status: {
                           state: true,
                           code: 'VC_2'
                       }
                   });

                   return false;

               }else{
                   return true
               }
           }

           let result;
           if(coupon_price_type == 1){
               const totalPrice = parseFloat(total_price);
               const discountPrice = (coupon_price_unit);
               result = totalPrice-discountPrice;
           }else if(coupon_price_type == 2){
               const totalPrice = parseFloat(total_price);
               const discountPercantage = (coupon_price_unit);
               const discountAmount = (totalPrice/discountPercantage);
               result = totalPrice-discountAmount;
           }

           res.json({
               data:`Kupon işlemi başarılı`,
               info:`Kupon işlemi başarılı`,
               result:result,
               coupon:checkValidate[0],
               status: {
                   state: true,
                   code: 'VC_3'
               }
           });
           return false;


       }

   }catch(e){
       console.log(e)
       res.json(e);
   }
});

module.exports = router;

