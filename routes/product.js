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

router.get('/', async(req, res, next) => {
   try{

   }catch(e){
       res.json(e);
   }
});

router.get('/:branch_id', cors(corsOptions), async(req, res, next) => {
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
                $sort:{
                    _id:-1,
                }
            }
        ]);

        res.json({
            data: products,
            status: {
                state: true,
                code: 'FP_1'
            }
        });
    }catch(e){
        res.json(e);
    }
});

router.get('/get/:product_id', async (req, res, next) => {
    try{
        const {product_id} = req.params;
        const product = await Product.findOne({_id: product_id});
        res.json({
            data: product,
            status: {
                state: true,
                code: 'FP_1'
            }
        })
    }catch(e){
        res.json(e);
    }
});

router.get('/get/:branch_id/:category_id', async(req, res, next) => {
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

router.post('/', cors(corsOptions), async (req, res, next) => {

   try{
       const {product_image, product_amonut, product_unit_weight, product_unit_type, branch_id, category_id, brand_id, product_name, product_list_price, product_discount_price, product_discount} = req.body;
       const product = new Product({
           branch_id:branch_id,
           category_id:category_id,
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

router.put('/edit/status', cors(corsOptions), async(req, res, next) => {
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

router.put('/edit/discount', cors(corsOptions), async(req, res, next) => {
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

router.put('/edit', cors(corsOptions), async(req, res, next) => {
   try{
       const {product_id, product_name, category_id, brand_id, product_unit_type, product_unit_weight,product_amonut} = req.body;
       const update = await Product.findByIdAndUpdate(product_id, {
           product_name:product_name,
           category_id: category_id,
           brand_id: brand_id,
           product_unit_type: product_unit_type,
           product_unit_weight: parseInt(product_unit_weight),
           product_amonut: parseInt(product_amonut)
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

router.put('/edit/image', cors(corsOptions), async(req, res, next) => {
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

router.delete('/:product_id', cors(corsOptions), async (req, res, next) => {
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

router.get('/search/:branch_id/:query', async (req, res, next) => {
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

router.get('/search/:branch_id/:category_id/:query', async (req, res, next) => {
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

module.exports = router;
