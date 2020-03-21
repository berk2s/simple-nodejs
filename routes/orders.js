const express = require('express');
const router = express.Router();

//config
const {PANEL_URL} = require('../constants/config');

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

router.get('/product/:order_id', cors(corsOptions), async (req, res, next) => {
    try{
        const {order_id} = req.params;
        const products = await Orders.findOne({_id:order_id});
        res.json({
            data: products.products,
            state: {
                status: true,
                code: 'FO_1'
            }
        });
    }catch(e){
        res.json(e);
    }
})

router.get('/open', cors(corsOptions), async (req, res, next) => {
    try{
        const openOrders = await Orders.find({order_status:0});
        res.json({
            data: openOrders,
            state: {
                status: true,
                code: 'FO_1'
            }
        });
    }catch(e){
        res.json(e);
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
            order_date:dateTurkey._d
        });

        const saveNewOrder = await newOrder.save();

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
