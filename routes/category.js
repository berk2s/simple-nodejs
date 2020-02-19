const express = require('express');
const router = express.Router();

// relevant model
const Category = require('../Models/Category');

router.get('/', async (req, res, next) => {
    try{
        const categories = await Category.find({});
        res.json(categories);
    }catch(e){
        console.log(e);
    }
});

router.post('/', async (req, res, next) => {
    const {category_name, category_image} = req.body;
    try{
        const category = new Category({
           category_name,
           category_image
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

module.exports = router;
