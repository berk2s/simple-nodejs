const express = require('express');
const router = express.Router();

var cors = require("cors");

const {PANEL_URL} = require('../constants/config')

var corsOptions = {
    origin: PANEL_URL,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const Order = require('../Models/Orders')
const Category = require('../Models/Category')
const Product = require('../Models/Product')

router.get('/weekly/:branch', cors(corsOptions), async (req, res, next) => {
    try{
        const { branch } = req.params;

        const moment = require('moment-timezone');

        const startDate_TypeDate = new Date();
        const finishDate_TypeDate= new Date();

        startDate_TypeDate.setDate(new Date().getDate()-(7))
        startDate_TypeDate.setHours(new Date().getHours()-(new Date().getHours()))

        finishDate_TypeDate.setDate(new Date().getDate())

        const { _d : startDate} = moment.tz(new Date(startDate_TypeDate), "Europe/Istanbul");

        const { _d : finishDate} = moment.tz(finishDate_TypeDate, "Europe/Istanbul");

        const result = await Order.find({
            order_date:
                {
                    $gte:startDate, // >=
                    $lte:finishDate // <=
                },
            order_status:3,
            is_bluecurrier:false,
            branch_id: branch
        }).sort({order_date:-1});

        const today = new Date();
        const todayDay = parseInt(today.getDate());

        const resultBudge = [0, 0, 0, 0, 0, 0, 0];

        result.map(e => {
                const orderDate = new Date(e.order_date);
                const orderDateDay = parseInt(orderDate.getDate());
                const orderPrice = parseFloat(e.price.value);

                if ((todayDay - 0) == orderDateDay) {
                    resultBudge[6] = resultBudge[6] + (orderPrice);
                }

                if ((todayDay - 1) == orderDateDay) {
                    resultBudge[5] = resultBudge[5] + (orderPrice);
                }

                if ((todayDay - 2) == orderDateDay) {
                    resultBudge[4] = resultBudge[4] + (orderPrice);
                }

                if ((todayDay - 3) == orderDateDay) {
                    resultBudge[3] = resultBudge[3] + (orderPrice);
                }

                if ((todayDay - 4) == orderDateDay) {
                    resultBudge[2] = resultBudge[2] + (orderPrice);
                }

                if ((todayDay - 5) == orderDateDay) {
                    resultBudge[1] = resultBudge[1] + (orderPrice);
                }

                if ((todayDay - 6) == orderDateDay) {
                    resultBudge[0] = resultBudge[0] + (orderPrice);
                }
        });

        res.json(resultBudge)

    }catch (e) {
        res.json(e);
    }
})

router.get('/category/all/:branch_id', cors(corsOptions), async (req, res, next) => {
    try{

        const result = await Order.find({order_status:3, is_bluecurrier:false, branch_id: req.params.branch_id});

        const orderProducts = []

        result.map(e => {
                e.products.map(e => {
                    for (let i = 0; i < e.count; i++) {
                        orderProducts.push(e);
                    }
                })
        });

        const resultWithCatId = orderProducts.map(e => e.product_category)

        const categoryList = await Category.find({})

        const productList = await Product.find({})

        const categoryLengths = [];
        const categoryNames = [];
        const categoryProductLengths = []

        categoryList.map(cat => {

            const specialFilter = resultWithCatId.filter(e => e == ''+cat._id).length;
            const specialFilter2 = productList.map(e => e.category_id).filter(e => e == ''+cat._id).length;

            categoryLengths.push(specialFilter);
            categoryProductLengths.push(specialFilter2);
            categoryNames.push(cat.category_name)

        });

        res.json({lengths: categoryLengths, names: categoryNames, productlengths: categoryProductLengths})

    }catch(e){
        res.json(e);
    }
})

router.get('/product/all/:branch_id', cors(corsOptions), async (req, res, next) => {
    try{

        const result = await Order.find({order_status:3, is_bluecurrier:false, branch_id: req.params.branch_id});

        const orderProducts = []

        result.map(e => {
            e.products.map(e => {
                for(let i = 0; i < e.count; i++){
                    orderProducts.push(e);
                }
            })
        });

        const orderProductsWithID = orderProducts.map(e => e.id);

        const products = await Product.find({branch_id: req.params.branch_id});

        const productsName = [];
        const satisMiktarLenght = []

        const urunMiktari = [];

        products.map(pro => {
                productsName.push(pro.product_name);

                const satisMiktari = orderProductsWithID.filter(e => e == '' + pro._id).length;

                satisMiktarLenght.push(satisMiktari);

                urunMiktari.push(pro.product_amonut);
        });

        console.log(satisMiktarLenght)
        console.log(urunMiktari)

        res.json({lengths: satisMiktarLenght, names: productsName, productlengths: urunMiktari})

    }catch(e){
        console.log(e)
    }
})

router.get('/totalorder/:branch_id', cors(corsOptions), async(req, res, next) => {
    try{
        const moment = require('moment-timezone');

        const startDate_TypeDate = new Date();
        const finishDate_TypeDate= new Date();

        startDate_TypeDate.setDate(new Date().getDate()-(7))
        startDate_TypeDate.setHours(new Date().getHours()-(new Date().getHours()))

        finishDate_TypeDate.setDate(new Date().getDate())

        const { _d : startDate} = moment.tz(new Date(startDate_TypeDate), "Europe/Istanbul");

        const { _d : finishDate} = moment.tz(finishDate_TypeDate, "Europe/Istanbul");

        const result = await Order.find({
            order_date:
                {
                    $gte:startDate, // >=
                    $lte:finishDate // <=
                },
            order_status:3,
            is_bluecurrier:false,
            branch_id:req.params.branch_id
        }).sort({order_date:-1});

        const today = new Date();
        const todayDay = parseInt(today.getDate());

        const resultBudge = [0, 0, 0, 0, 0, 0, 0];

        result.map(e => {
            const orderDate = new Date(e.order_date);
            const orderDateDay = parseInt(orderDate.getDate());

            if((todayDay-0) == orderDateDay){
                resultBudge[6] = parseInt(resultBudge[6]+(1));
            }

            if((todayDay-1) == orderDateDay){
                resultBudge[5] = parseInt(resultBudge[5]+(1));
            }

            if((todayDay-2) == orderDateDay){
                resultBudge[4] = parseInt(resultBudge[4]+(1));
            }

            if((todayDay-3) == orderDateDay){
                resultBudge[3] = parseInt(resultBudge[3]+(1));
            }

            if((todayDay-4) == orderDateDay){
                resultBudge[2] = parseInt(resultBudge[2]+(1));
            }

            if((todayDay-5) == orderDateDay){
                resultBudge[1] = parseInt(resultBudge[1]+(1));
            }

            if((todayDay-6) == orderDateDay){
                resultBudge[0] = parseInt(resultBudge[0]+(1));
            }

        });

        res.json({totalorder: result.length, result: resultBudge});
    }catch(e){
        res.json(e);
    }
})

module.exports = router;
