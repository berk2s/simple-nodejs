const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// relevant model
const Brand = require('../Models/Brand');
const Product = require('../Models/Product')
//config
const {PANEL_URL} = require('../constants/config');

//cors
var cors = require("cors");

var corsOptions = {
    origin: PANEL_URL,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
const apikeyPanelMiddleware = require('../middleware/apikeypanel')

router.get('/', apikeyPanelMiddleware, async (req, res, next) => {
    try{
        const result = await Brand.find({});
        res.json({
            data: result,
            status: {
                state: true,
                code: 'FB_1'
            }
        });
    }catch(e){
        res.json({
            data: e,
            status: {
                state: true,
                code: 'FB_0'
            }
        });
    }
});

router.get('/:branch_id', apikeyPanelMiddleware, async (req, res, next) => {
    try{
        const {branch_id} = req.params;
        const result = await Brand.aggregate([
            {
                $match: {
                    branch_id: parseInt(branch_id)
                }
            },
            {
                $lookup:
                    {
                        from: 'categories',
                        localField: 'category_id',
                        foreignField: '_id',
                        as: 'category'
                    }
            },
            {
                $unwind:{
                    path:'$category',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group:{
                    _id:{
                        _id:'$_id',
                        brand_name:'$brand_name',
                        brand_date:'$brand_date',
                        brach_id:'$branch_id',
                        category_id:'$category_id',
                    },
                    category:{
                        $push:'$category'
                    }
                }
            },
            {
                $project:{
                    _id:'$_id._id',
                    brand_name:'$_id.brand_name',
                    brand_date:'$_id.brand_date',
                    category_id:'$_id.category_id',
                    branch_id:'$_id.branch_id',
                    category:'$category',
                }
            },

        ]);
        res.json({
            data: result,
            status: {
                state: true,
                code: 'FB_1'
            }
        });
    }catch(e){
        res.json({
            data: e,
            status: {
                state: true,
                code: 'FB_0'
            }
        });
    }
});

router.get('/get/:brand_id', apikeyPanelMiddleware, async (req, res, next) => {
    try{
        const {brand_id} = req.params;
        const result = await Brand.aggregate([
            {
                $match: {
                    _id: mongoose.Types.ObjectId(brand_id)
                }
            },
            {
                $lookup:
                    {
                        from: 'categories',
                        localField: 'category_id',
                        foreignField: '_id',
                        as: 'category'
                    }
            },
            {
                $unwind:{
                    path:'$category',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group:{
                    _id:{
                        _id:'$_id',
                        brand_name:'$brand_name',
                        brand_date:'$brand_date',
                        brach_id:'$branch_id',
                        category_id:'$category_id',
                    },
                    category:{
                        $push:'$category'
                    }
                }
            },
            {
                $project:{
                    _id:'$_id._id',
                    brand_name:'$_id.brand_name',
                    brand_date:'$_id.brand_date',
                    category_id:'$_id.category_id',
                    branch_id:'$_id.branch_id',
                    category:'$category',
                }
            },

        ]);
        res.json({
            data: result,
            status: {
                state: true,
                code: 'FB_1'
            }
        });
    }catch(e){
        res.json({
            data: e,
            status: {
                state: true,
                code: 'FB_0'
            }
        });
    }
})

router.post('/', apikeyPanelMiddleware, async(req, res, next) => {
    try{
        const {branch_id, brand_name} = req.body;
        const brand = new Brand({
            branch_id: branch_id,
            brand_name: brand_name
        });
        const brand_ = await brand.save();
        res.json({
            data: brand_,
            status: {
                state: true,
                code: 'CB_1'
            }
        });
    }catch(e){
        res.json({
            data: e,
            status: {
                state: true,
                code: 'CB_0'
            }
        });
    }
});

router.put('/', apikeyPanelMiddleware, async(req, res, next) => {
    try{
        const {brand_id, brand_name, brand_category} = req.body;
        const brand = await Brand.findByIdAndUpdate(brand_id,{
            brand_name: brand_name,
            category_id: brand_category
        });
        res.json({
            data: brand,
            status: {
                state: true,
                code: 'UB_1'
            }
        });
    }catch(e){
        res.json(e);
    }
})

router.delete('/', apikeyPanelMiddleware, async(req, res, next) => {
    try{
        await Brand.deleteOne({_id: req.body.brand_id});
        await Product.updateMany({brand_id: req.body.brand_id}, {$set: {brand_id: null}});
        res.json({});
    }catch(e){
        res.json(e);
    }
})

module.exports = router;
