const express = require('express');
const router = express.Router();

//config
const {PANEL_URL} = require('../constants/config');

const FCM = require('../helper/fcm')

//cors
var cors = require("cors");

var corsOptions = {
    origin: PANEL_URL,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// socket.io
const socketApi = require('../src/socketApi');

const {TIERED_START} = require('../constants/config');

const Orders = require('../Models/Orders')
const User = require('../Models/User')
const Coupon = require('../Models/Coupon')

const mongoose = require('mongoose')

router.get('/user/open/:user_id', async (req, res, next) => {
    try{
        const {user_id} = req.params;
        const openOrders = await Orders.aggregate([
            {
                $match:{
                    user_id:mongoose.Types.ObjectId(user_id),
                    $or: [
                        {order_status:0},
                        {order_status:1},
                        {order_status:2}
                    ]
                },
            },
            {
                $group:{
                    _id:{
                        _id:'$_id',
                        visibility_id:'$visibility_id',
                        products:'$products',
                        price:'$price',
                        order_status:'$order_status',
                        order_note:'$order_note',
                        coupon:'$coupon',
                        is_bluecurrier:'$is_bluecurrier',
                        payload_type:'$payload_type',
                        user_address:'$user_address',
                        branch_id:'$branch_id',
                        order_date:'$order_date',
                        order_history_prepare:'$order_history_prepare',
                        order_history_enroute:'$order_history_enroute',
                        order_history_success:'$order_history_success',
                        order_history_cancel:'$order_history_cancel',
                    }
                }
            },
            {
                $project:{
                    _id:'$_id._id',
                    visibility_id:'$_id.visibility_id',
                    products:'$_id.products',
                    price:'$_id.price',
                    order_status:'$_id.order_status',
                    order_note:'$_id.order_note',
                    coupon:'$_id.coupon',
                    is_bluecurrier:'$_id.is_bluecurrier',
                    payload_type:'$_id.payload_type',
                    user_address:'$_id.user_address',
                    order_date:'$_id.order_date',
                    branch_id:'$_id.branch_id',
                    order_history_prepare:'$_id.order_history_prepare',
                    order_history_enroute:'$_id.order_history_enroute',
                    order_history_success:'$_id.order_history_success',
                    order_history_cancel:'$_id.order_history_cancel',
                }
            },


            {
                $sort: {
                    _id:-1
                }
            }
        ]);


        res.json({
            data: openOrders,
            state: {
                status: true,
                code: 'FO_1'
            }
        })
    }catch(e){
        res.json({
            data: e,
            state: {
                status: true,
                code: 'EE_1'
            }
        })
    }
});

router.get('/user/history/:user_id', async (req, res, next) => {
    try{
        const {user_id} = req.params;
        const openOrders =  await Orders.aggregate([
            {
                $match:{
                    user_id:mongoose.Types.ObjectId(user_id),
                    $or: [
                        {order_status:parseInt(-1)},
                        {order_status:3},
                    ]
                },
            },
            {
                $group:{
                    _id:{
                        _id:'$_id',
                        visibility_id:'$visibility_id',
                        products:'$products',
                        price:'$price',
                        order_status:'$order_status',
                        order_note:'$order_note',
                        coupon:'$coupon',
                        is_bluecurrier:'$is_bluecurrier',
                        payload_type:'$payload_type',
                        user_address:'$user_address',
                        branch_id:'$branch_id',
                        order_date:'$order_date',
                        order_history_prepare:'$order_history_prepare',
                        order_history_enroute:'$order_history_enroute',
                        order_history_success:'$order_history_success',
                        order_history_cancel:'$order_history_cancel',
                    }
                }
            },
            {
                $project:{
                    _id:'$_id._id',
                    visibility_id:'$_id.visibility_id',
                    products:'$_id.products',
                    price:'$_id.price',
                    order_status:'$_id.order_status',
                    order_note:'$_id.order_note',
                    coupon:'$_id.coupon',
                    is_bluecurrier:'$_id.is_bluecurrier',
                    payload_type:'$_id.payload_type',
                    user_address:'$_id.user_address',
                    order_date:'$_id.order_date',
                    branch_id:'$_id.branch_id',
                    order_history_prepare:'$_id.order_history_prepare',
                    order_history_enroute:'$_id.order_history_enroute',
                    order_history_success:'$_id.order_history_success',
                    order_history_cancel:'$_id.order_history_cancel',
                }
            },


            {
                $sort: {
                    _id:-1
                }
            }
        ]);
        res.json({
            data: openOrders,
            state: {
                status: true,
                code: 'FO_1'
            }
        })
    }catch(e){
        res.json({
            data: e,
            state: {
                status: true,
                code: 'EE_1'
            }
        })
    }
});

router.post('/', async (req, res, next) => {
    try{
        const {
            user_id,
            user_address,
            payload_type,
            products,
            price,
            order_note,
            is_bluecurrier,
            coupon,
            branch_id
        } = req.body;

        const moment = require('moment');
        const dateTurkey = moment.tz(Date.now(), "Europe/Istanbul");


        const newOrder = new Orders({
            visibility_id:Date.now(),
            user_id:user_id,
            user_address:user_address,
            payload_type:payload_type,
            products:products,
            price:price,
            order_note:order_note,
            is_bluecurrier:is_bluecurrier,
            coupon:coupon,
            order_date:dateTurkey._d,
            order_history_pending:dateTurkey._d,
            branch_id:branch_id
        });

        const saveNewOrder = await newOrder.save();

        //
        if(coupon != null) {
            const userDetails = await User.findOne({_id: user_id});
            const couponDetailts = await Coupon.findOne({_id: coupon._id})
            const newUsedBy = [...couponDetailts.used_by];
            newUsedBy.push({id: user_id, name: userDetails.name_surname})
            const updateCoupon = await Coupon.findByIdAndUpdate(coupon._id, {
                used_by: newUsedBy
            });
        }
        //
        socketApi.io.emit('newOrder', {order: saveNewOrder});

        res.json({
            data: saveNewOrder,
            status: {
                state: true,
                code: 'IO_1'
            }
        })
    }catch(e){
        console.log(e);
    }
})

module.exports = router;
