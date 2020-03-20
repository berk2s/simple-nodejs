const express = require('express');
const router = express.Router();

// relevant model
const P_coupon = require('../Models/Coupon');

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

router.get('/', async (req, res, next) => {
    try{
        const coupons = await P_coupon.find();
        res.json({
            data:coupons,
            status: {
                state: true,
                code: 'CC_1'
            }
        })
    }catch(e){
        console.log(e);
    }
})

router.post('/', cors(corsOptions), async (req, res, next) => {
   try{
       const {coupon_name, coupon_text, coupon_amount,coupon_status, coupon_price_type, coupon_price_unit, coupon_time, limit_price, limit_selected_items_only, limit_selected_categories_only, limit_selected_items,} = req.body;

       let coupon_start;
       let coupon_end;

       if(coupon_status == false) {
           coupon_start = null;
           coupon_end = null;
       }else{
           const startDate = momentTZ.tz(Date.now(), "Europe/Istanbul");
           const endDate = moment(momentTZ.tz(Date.now(), "Europe/Istanbul"));
           endDate.add(parseInt(coupon_time), 'h');

           coupon_start = startDate._d;
           coupon_end = endDate._d;
       }

       const newCoupon = new P_coupon({
           coupon_name:coupon_name,
          coupon_text:coupon_text,
           coupon_amount:coupon_amount,
           coupon_status:coupon_status,
           coupon_price_type:coupon_price_type,
           coupon_price_unit:coupon_price_unit,
           coupon_start:coupon_start,
           coupon_end:coupon_end,
           coupon_time:coupon_time,
           limit_price:limit_price,
           limit_selected_items_only:limit_selected_items_only,
           limit_selected_categories_only:limit_selected_categories_only,
           limit_selected_items:limit_selected_items,
       });

       const saveCoupon = await newCoupon.save();
       res.json({
           data:saveCoupon,
           status: {
               state: true,
               code: 'CC_1'
           }
       })

   } catch(e) {
       console.log(e)
       res.json(e);
   }
});

router.get('/check/:coupon_name', async (req, res, next) => {
    try{
        const {coupon_name} = req.params;
        const findIt = await P_coupon.find({coupon_name:coupon_name});
        if(findIt.length == 0){
            res.json({status:true})
        }else{
            res.json({status:false})
        }
    }catch(e){
        res.json(e);
    }
})

router.put('/test', async (req, res, next) => {
    try{
        const {coupon_id} = req.body;
        const relevantCoupon = await P_coupon.findOne({_id: coupon_id});

        res.json(relevantCoupon.used_by);
    }catch(e){
        res.json(e);
    }
})

module.exports = router;

