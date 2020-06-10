const express = require('express');
const router = express.Router();

const SubCategory = require('../Models/SubCategory')
const apikeyPanelMiddleware = require('../middleware/apikeypanel')
const bothMid = require('../middleware/bothmid')

router.get('/:category_id', bothMid, async (req, res, next) => {
    try{
        const {category_id} = req.params;
        const subCategories = await SubCategory.find({category_id:category_id});
        res.json({
            data:subCategories,
            status: {
                state: true,
                code: 'FS_1'
            }
        });
    }catch(e){
        res.json({
            data:saveSub,
            status: {
                state: true,
                code: 'EE_1'
            }
        });
    }
})

router.post('/', apikeyPanelMiddleware, async (req, res, next) => {
    try{
        const {sub_category_name, category_id, branch_id} = req.body;
        const newSub = new SubCategory({
            sub_category_name:sub_category_name,
            category_id:category_id,
            branch_id: branch_id
        });
        const saveSub = await newSub.save();
        res.json({
            data:saveSub,
            status:{
                state:true,
                code:'AS_1'
            }
        })
    }catch(e){
        res.json({
            data:saveSub,
            status: {
                state: true,
                code: 'EE_1'
            }
        });
    }
})

module.exports = router;
