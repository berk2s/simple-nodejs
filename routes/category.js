const express = require('express');
const router = express.Router();

// relevant model
const Category = require('../Models/Category');

//config
const {PANEL_URL} = require('../constants/config');

//cors
var cors = require("cors");

var corsOptions = {
    origin: PANEL_URL,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}


router.get('/', async (req, res, next) => {
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

router.get('/p/get/:category_id', cors(corsOptions), async (req, res, next) => {
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

router.get('/:branch_id', cors(corsOptions), async (req, res, next) => {
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

router.get('/current/:branch_id', async (req, res, next) => {
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

router.post('/', async (req, res, next) => {
    const {category_name, category_image, branch_id} = req.body;
    try{
        const category = new Category({
           category_name,
           category_image,
           branch_id
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

router.put('/p/edit', cors(corsOptions), async (req, res, next) => {
    const {category_id, category_name, category_image, status} = req.body;
    try{
        const update = await Category.findByIdAndUpdate(category_id, {
            category_name: category_name,
            category_image:category_image,
            status: status
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

router.put('/p/edit/status', cors(corsOptions), async(req, res, next) => {
    try{
        const {category_id, status} = req.body;
        const updatestatus = await Category.findByIdAndUpdate(category_id, {
            status: status
        });
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

router.put('/p/delete/image', cors(corsOptions), async (req, res, next) => {
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

router.delete('/p/delete/:category_id', cors(corsOptions), async(req, res, next) => {
    try{
        const {category_id} = req.params;
        const result = await Category.findByIdAndDelete(category_id);
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
