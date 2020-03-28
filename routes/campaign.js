const express = require('express');
const router = express.Router();

const Campaign = require('../Models/Campaign');
const {PANEL_URL} = require('../constants/config');

//cors
var cors = require("cors");

var corsOptions = {
    origin: PANEL_URL,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

router.get('/:branch_id', async (req, res, next) => {
    try{
        console.log(req.params.branch_id)
        const campaigns = await Campaign.aggregate([
            {
                $match:{
                    status:true,
                }
            },
            {
                $match:{
                    branch_id:parseInt(req.params.branch_id),
                }
            },
            {
                $sort: {
                    _id:-1
                }
            }
        ]);
        res.json({
            data:campaigns,
            status:{
                state:false,
                code:'EE_1'
            }
        })
    }catch(e){
        console.log(e)
        res.json({
            data:e,
            status:{
                state:false,
                code:'EE_1'
            }
        })
    }
});

router.post('/', cors(corsOptions), async (req, res, next) => {
    try{
        const {
            campaign_name,
            campaign_short_desc,
            campaign_type,
            campaign_desc,
            campaign_image,
            branch_id
        } = req.body;

        console.log(branch_id)

        const moment = require('moment');
        const dateTurkey = moment.tz(Date.now(), "Europe/Istanbul");

        const time = dateTurkey._d;

        const desc = parseInt(campaign_type) == 1 ? campaign_desc : null;

        const newCampaign = new Campaign({
            campaign_name:campaign_name,
            campaign_short_desc:campaign_short_desc,
            campaign_type:campaign_type,
            campaign_image:campaign_image,
            campaign_desc:desc,
            campaign_date:time,
            branch_id:branch_id
        })

        const saveCampaign = await newCampaign.save();

        console.log(saveCampaign)

        res.json({
            data:saveCampaign,
            status:{
                state:true,
                code:'AC_1'
            }
        })

    }catch(e){
        console.log(e)
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
