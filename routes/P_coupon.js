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

router.delete('/', cors(corsOptions), async (req, res, next) => {
    try{
        const {coupon_id} = req.body;
        await P_coupon.deleteOne({_id:coupon_id});
        res.json({
            data:'ok',
            status:{
                state:true,
                code:'DC_1'
            }
        })
    }catch(e){
        res.json(e);
    }
})

router.put('/status', cors(corsOptions), async (req, res, next) => {
    try{
        const {coupon_id, status} = req.body;

        if(status == true){
            const relevantCoupon = await P_coupon.findOne({_id:coupon_id});
            const coupon_time = relevantCoupon.coupon_time;

            let coupon_start;
            let coupon_end;


            var moment = require('moment');
            const momentTZ = require('moment-timezone');

                const startDate = momentTZ.tz(Date.now(), "Europe/Istanbul");
                const endDate = moment(momentTZ.tz(Date.now(), "Europe/Istanbul"));
                endDate.add(parseInt(coupon_time), 'h');

                coupon_start = startDate._d;
                coupon_end = endDate._d;


                console.log(coupon_time)
                console.log(coupon_start)
                console.log(coupon_end)

            await P_coupon.updateOne({_id: coupon_id}, {
                coupon_status:status,
                coupon_start:coupon_start,
                coupon_end:coupon_end
            });

        }else{
            await P_coupon.updateOne({_id: coupon_id}, {
                coupon_status:status
            });
        }

        res.json({
            data:'ok',
            status:{
                state:true,
                code:'UC_1'
            }
        })
    }catch(e){
        res.json(e);
    }
})

router.get('/get/:coupon_id', cors(corsOptions), async (req, res, next) => {
    try{
        const {coupon_id} = req.params;
        const coupon = await P_coupon.find({_id:coupon_id});
        res.json({
            data:coupon
        })
    }catch(e){
        res.json(e);
    }
})

router.get('/:branch_id', cors(corsOptions), async (req, res, next) => {
    try{
        const {branch_id} = req.params;
        console.log(branch_id);
        const coupon = await P_coupon.find({branch_id:parseInt(branch_id)});
        res.json({
            data:coupon,
            status:{
                state:true,
                code:'FC_1'
            }
        })
    }catch(e){
        res.json(e);
    }
});

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
       const {branch_id, coupon_name, coupon_text, coupon_amount,coupon_status, coupon_price_type, coupon_price_unit, coupon_time, limit_price, limit_selected_items_only, limit_selected_categories_only, limit_selected_items,} = req.body;

       var moment = require('moment');
       const momentTZ = require('moment-timezone');

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
           branch_id:branch_id
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

