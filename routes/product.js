const express = require('express');
const router = express.Router();

// relevant model
const Product = require('../Models/Product');

//config
const {PANEL_URL} = require('../constants/config');

//cors
var cors = require("cors");

var corsOptions = {
    origin: PANEL_URL,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
const apikeyPanelMiddleware = require('../middleware/apikeypanel')

const mongoose = require('mongoose');
const bothMid = require('../middleware/bothmid')

router.get('/', async(req, res, next) => {
   try{

   }catch(e){
       res.json(e);
   }
});

router.get('/:branch_id',  bothMid, async(req, res, next) => {
    try{
        const {branch_id} = req.params;
        const products = await Product.aggregate([
            {
                $match:{
                    branch_id: parseInt(branch_id)
                }
            },
            {
                $lookup:{
                    from:'categories',
                    foreignField:'_id',
                    localField:'category_id',
                    as:'category'
                }
            },
            {
                $lookup:{
                    from:'subcategories',
                    foreignField:'_id',
                    localField:'sub_category_id',
                    as:'subcategory'
                }
            },
            {
                $lookup:{
                    from:'brands',
                    foreignField:'_id',
                    localField:'brand_id',
                    as:'brand'
                }
            },
            {
                $unwind:{
                    path:'$category',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind:{
                    path:'$brand',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind:{
                    path:'$subcategory',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $sort:{
                    _id:1,
                }
            }
        ]);

        const randomizeArray = new Promise((resolve, reject) => {
            let currentIndex = products.length, temporaryValue, randomIndex;

            // While there remain elements to shuffle...
            while (0 !== currentIndex) {

                // Pick a remaining element...
                let randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                // And swap it with the current element.
                let temporaryValue = products[currentIndex];
                products[currentIndex] = products[randomIndex];
                products[randomIndex] = temporaryValue;
            }

            resolve(products);
        })

        const mixResult = await randomizeArray

        res.json({
            dataLength: mixResult.length,
            data: mixResult,
            status: {
                state: true,
                code: 'FP_1'
            }
        });
    }catch(e){
        res.json(e);
    }
});

router.get('/get/basket/:product_id',bothMid, async (req, res, next) => {
    try{
        const {product_id} = req.params;
        const product = await Product.findOne({_id: product_id, product_status:true});
        res.json({
            data: product,
            status: {
                state: true,
                code: 'FP_1'
            }
        })
    }catch(e){
        res.json({
            data: null,
            err: e,
            status: {
                state: true,
                code: 'FP_1'
            }
        });
    }
});

router.get('/get/:product_id', bothMid, async (req, res, next) => {
    try{
        const {product_id} = req.params;
        const product = await Product.findOne({_id: product_id, product_status:true});

        res.json({
            data: product,
            status: {
                state: true,
                code: 'FP_1'
            }
        })
    }catch(e){
        res.json({
            data: e,
            status: {
                state: true,
                code: 'EE_1'
            }
        });
    }
});

router.get('/get/:branch_id/:category_id', bothMid, async(req, res, next) => {
   try{
       const {branch_id, category_id} = req.params;
       const datas = await Product.find({branch_id: branch_id, category_id: category_id});
       res.json({
           data: datas,
           status: {
               state: true,
               code: 'FP_1'
           }
       });
   }catch(e){
       res.json(e);
   }
});

router.post('/', apikeyPanelMiddleware, async (req, res, next) => {

   try{
       const {product_image, product_amonut, sub_category_id, product_unit_weight, product_unit_type, branch_id, category_id, brand_id, product_name, product_list_price, product_discount_price, product_discount} = req.body;

       let subid = null;

       if(sub_category_id.trim() != '')
           subid = sub_category_id;

       console.log(subid);
       console.log(typeof subid);

       const product = new Product({
           branch_id:branch_id,
           category_id:category_id,
           sub_category_id:subid == 'null' ? null : subid,
           brand_id:brand_id,
           product_name:product_name,
           product_list_price:product_list_price,
           product_discount_price:product_discount_price,
           product_discount:product_discount,
           product_unit_type:product_unit_type,
           product_unit_weight:product_unit_weight,
           product_amonut:product_amonut,
           product_image:product_image
       });
       const res_ = await product.save();
       res.json({
           data: res_,
           status: {
               state: true,
               code: 'CP_1'
           }
       });
   }catch(e){
       console.log(e)
   }
});

router.put('/edit/status', apikeyPanelMiddleware, async(req, res, next) => {
   try{
       const {product_id, status} = req.body;
       const updateProduct = await Product.findByIdAndUpdate(product_id, {
           product_status: status
       });
       res.json({
           data: updateProduct,
           status: {
               state: true,
               code: 'UP_1'
           }
       });
   }catch(e){
       res.json(e);
   }
});

router.put('/edit/discount', apikeyPanelMiddleware, async(req, res, next) => {
   try{
       const {product_id, product_list_price, product_discount_price, product_discount} = req.body;
       const discountUpdate = await Product.findByIdAndUpdate(product_id, {
           product_list_price:product_list_price,
           product_discount_price:product_discount_price,
           product_discount: product_discount
       });
       res.json({
           data: discountUpdate,
           status: {
               state: true,
               code: 'UD_1'
           }
       });
   }catch(e){
       res.json(e);
   }
});

router.put('/edit', apikeyPanelMiddleware, async(req, res, next) => {
   try{
       const {sub_category_id, product_id, product_name, category_id, brand_id, product_unit_type, product_unit_weight,product_amonut} = req.body;
       const update = await Product.findByIdAndUpdate(product_id, {
           product_name:product_name,
           category_id: category_id,
           brand_id: brand_id,
           product_unit_type: product_unit_type,
           product_unit_weight: parseInt(product_unit_weight),
           product_amonut: parseInt(product_amonut),
           sub_category_id:sub_category_id != 'null' ? sub_category_id : null
       });
       res.json({
           data: update,
           status: {
               state: true,
               code: 'UD_1'
           }
       });
   }catch(e){
       res.json(e);
   }
});

router.put('/edit/image', apikeyPanelMiddleware, async(req, res, next) => {
   try{
       const {imagename, product_id} = req.body;
       const image = await Product.findByIdAndUpdate(product_id, {
           product_image: imagename
       });
       res.json({
           data: image,
           status: {
               state: true,
               code: 'UD_1'
           }
       });
   }catch(e){
       res.json(e);
   }
});

router.delete('/:product_id', apikeyPanelMiddleware, async (req, res, next) => {
   try{
       const {product_id} = req.params;
       const deleteProduct = await Product.findByIdAndDelete(product_id);
       res.json({
           data: deleteProduct,
           status: {
               state: true,
               code: 'DP_1'
           }
       });
   }catch(e){
       res.json(e);
   }
});

router.get('/search/:branch_id/:query', bothMid, async (req, res, next) => {
    try{
        const {query, branch_id} = req.params;
        console.log(query)
        //const result = await Product.find({$text: { $search: query, $language:'tr', $caseSensitive:false }})

        const result = await Product.find({ "product_name": new RegExp(query, "gi"), 'branch_id':branch_id });

        res.json({
            data: result,
            status: {
                state: true,
                code: 'SP_1'
            }
        })
    }catch(e){
        res.json(e);
    }
})

router.get('/search/:branch_id/:category_id/:query', bothMid, async (req, res, next) => {
    try{
        const {category_id, query, branch_id} = req.params;
        const result = await Product.find({branch_id:branch_id, category_id:category_id, "product_name": new RegExp(query, "gi")});

        res.json({
            data: result,
            status: {
                state: true,
                code: 'SP_1'
            }
        })
    }catch(e){
        res.json(e);
    }
})

router.get('/sub/:sub_category_id', bothMid, async (req, res, next) => {
    try{
        const {sub_category_id} = req.params;

        const products = await Product.find({sub_category_id:sub_category_id});

        res.json({
            data:products,
            status:{
                state:false,
                code:'FP_1'
            }
        })
    }catch(e){
        res.json({
            data:e,
            status:{
                state:false,
                code:'EE_1'
            }
        })
    }
})

module.exports = router;
