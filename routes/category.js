const express = require('express');
const router = express.Router();

// relevant model
const Category = require('../Models/Category');
const SubCategory = require('../Models/SubCategory');
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
const bothMid = require('../middleware/bothmid')

router.get('/', bothMid, async (req, res, next) => {
    try{
        const categories = await Category.find({});
        res.json({
            data: categories,
            status: {
                state: true,
                code: 'FC_1'
            }
        });
    }catch(e){
        res.json({
            data: e,
            status: {
                state: true,
                code: 'FC_0'
            }
        });
    }
});

router.get('/p/get/:category_id', apikeyPanelMiddleware, async (req, res, next) => {
    const {category_id} = req.params;
    try{
        const category = await Category.findById(category_id);
        res.json({
            data: category,
            status: {
                state: true,
                code: 'FC_1'
            }
        });
    }catch(e){
        console.log({
            data: e,
            status: {
                state: true,
                code: 'FC_0'
            }
        });
    }
});

router.get('/:branch_id', apikeyPanelMiddleware, async (req, res, next) => {
    const {branch_id} = req.params;
    try{
        const categories = await Category.find({branch_id});
        res.json({
            data: categories,
            status: {
                state: true,
                code: 'FBC_1'
            }
        });
    }catch(e){
        res.json({
            data: categories,
            status: {
                state: false,
                code: 'FBC_0'
            }
        });
    }
});

router.get('/v2/current/:branch_id', bothMid, async (req, res, next) => {
    const {branch_id} = req.params;
    try{
        const categories = await Category.aggregate([
            {
                $match:{
                    branch_id: parseInt(branch_id)
                }
            },
            {
                $lookup:{
                    from:'subcategories',
                    foreignField:'category_id',
                    localField:'_id',
                    as:'subcategories'
                }
            },

            {
                $unwind:{
                    path:'$category',
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $sort:{
                    _id:1,
                }
            }
        ])
        res.json({
            data: categories,
            status: {
                state: true,
                code: 'FBC_1'
            }
        });
    }catch(e){
        res.json({
            data: e,
            status: {
                state: false,
                code: 'FBC_0'
            }
        });
    }
});

router.get('/current/:branch_id', bothMid, async (req, res, next) => {
    const {branch_id} = req.params;
    try{
        const categories = await Category.find({branch_id: branch_id, status:true});
        res.json({
            data: categories,
            status: {
                state: true,
                code: 'FBC_1'
            }
        });
    }catch(e){
        res.json({
            data: e,
            status: {
                state: false,
                code: 'FBC_0'
            }
        });
    }
});

router.post('/', apikeyPanelMiddleware, async (req, res, next) => {
    const {category_name, category_image, branch_id} = req.body;
    try{
        const moment = require('moment');
        const dateTurkey = moment.tz(Date.now(), "Europe/Istanbul");

        const category = new Category({
           category_name:category_name,
           category_image:category_image,
           branch_id:branch_id,
            created_at:dateTurkey._d
        });
        const category_ = await category.save();
        res.json({
            category: category_,
            state:{
                status: true,
                code:'NC_1'
            }
        });
    }catch(e){
        console.log(e)
    }
});

router.put('/p/edit', apikeyPanelMiddleware, async (req, res, next) => {
    const {category_id, category_name, category_image, status, delete_subs} = req.body;
    try{
        const update = await Category.findByIdAndUpdate(category_id, {
            category_name: category_name,
            category_image:category_image,
            status: status
        });

        console.log(delete_subs)

        delete_subs.map(async e => {
            const deleteit = await SubCategory.deleteOne({_id: e});
            const updateit = await Product.updateMany({'sub_category_id': e}, {'$set': {'sub_category_id': null}});
        });

        res.json({
            data: update,
            status: {
                state: true,
                code: 'UC_1'
            }
        });
    }catch(e){
        res.json({
            data: e,
            status: {
                state: false,
                code: 'UC_0'
            }
        });
        console.log(e)
    }
});

router.put('/p/edit/status', apikeyPanelMiddleware, async(req, res, next) => {
    try{
        const {category_id, status} = req.body;
        const updatestatus = await Category.findByIdAndUpdate(category_id, {
            status: status
        });

        await Product.updateMany({'category_id': category_id}, {'$set': {'product_status': status}});

        res.json({
            data: updatestatus,
            status: {
                state: true,
                code: 'SC_1'
            }
        });
    }catch(e){
        res.json(e);
    }
});

router.put('/p/delete/image', apikeyPanelMiddleware, async (req, res, next) => {
    try{
        const {category_id} = req.body;
        const result = await Category.findByIdAndUpdate(category_id, {
            category_image:null
        });
        res.json({
            category: result,
            state:{
                status:true,
                code:'IC_1'
            }
        });
    }catch(e){
        res.json(e);
    }
})

router.delete('/p/delete/:category_id', apikeyPanelMiddleware, async(req, res, next) => {
    try{
        const {category_id} = req.params;
        const result = await Category.findByIdAndDelete(category_id);

        await Product.updateMany({'category_id': category_id}, {'$set': {'category_id': null, 'product_status': false}});
        await SubCategory.updateMany({'category_id': category_id}, {'$set': {'category_id': null}});

        res.json({
            category: result,
            state:{
                status:true,
                code:'DC_1'
            }
        });
    }catch(e){
        res.json(e);
    }
})

module.exports = router;
