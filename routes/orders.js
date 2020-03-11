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

router.get('/', async (req, res, next) => {
    socketApi.io.emit('test', {order:1});
    res.json();
});

router.post('/', async (req, res, next) => {
    try{
        const {user_id, user_address, payload_type, products, price, order_note, is_bluecurrier} = req.body;
        const newOrder = new Orders({
            user_id:user_id,
            user_address:user_address,
            payload_type:payload_type,
            products:products,
            price:price,
            order_note:order_note,
            is_bluecurrier:is_bluecurrier
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
