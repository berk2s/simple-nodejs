const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const moment = require('moment-timezone');

// relevant model
const BranchStatus = require('../Models/BranchStatus');

//config
const {PANEL_URL} = require('../constants/config');
const apikeyPanelMiddleware = require('../middleware/apikeypanel')
//cors
var cors = require("cors");

var corsOptions = {
    origin: PANEL_URL,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const bothMid = require('../middleware/bothmid')


const dateTurkey = moment.tz(Date.now(), "Europe/Istanbul");

router.get('/:branch_id', bothMid, async(req, res, next) => {
    try{
        const {branch_id} = req.params;
        const branchStatus = await BranchStatus.findOne({branch_id: branch_id});

        res.json({
            data: {
                status:branchStatus.status,
                message: branchStatus.message
            },
            status: {
                state: true,
                code: 'BS_1'
            }
        });
    }catch(e){
        res.json({
            data: 'Beklenmedik hata oluştu',
            status: {
                state: false,
                code: 'EE_1'
            }
        })
    }
});

router.post('/', apikeyPanelMiddleware, async(req, res, next) => {
    try{
        const timeZone = dateTurkey._d;
        const {branch_id, status, message} = req.body;

        const statusPost = new BranchStatus({
            branch_id: parseInt(branch_id),
            status: status,
            message:message,
            process_date:timeZone
        });

        const statusSave = await statusPost.save();

        res.json({
            data: statusSave,
            status: {
                state: true,
                code: 'PB_1'
            }
        });

    }catch(e){
        res.json({
            data: e,
            status: {
                state: true,
                code: 'PB_0'
            }
        });
    }
});

router.put('/', apikeyPanelMiddleware, async(req, res, next) => {
    try{
        const {branch_id, message} = req.body;
        const branchStatus = await BranchStatus.findOneAndUpdate({branch_id: branch_id},{
            message:message
        });
        res.json({
            data: branchStatus,
            status: {
                state: true,
                code: 'UB_1'
            }
        });
    }catch(e){
        res.json({
            data: e,
            status: {
                state: true,
                code: 'UB_0'
            }
        });
    }
});

router.put('/open', apikeyPanelMiddleware, async(req, res, next) => {
    try{
        const {branch_id} = req.body;
        const branchStatus = await BranchStatus.findOneAndUpdate({branch_id: branch_id},{
            status: true
        });
        res.json({
            data: branchStatus,
            status: {
                state: true,
                code: 'UB_1'
            }
        });
    }catch(e){
        res.json({
            data: e,
            status: {
                state: true,
                code: 'UB_0'
            }
        });
    }
});

router.put('/close', apikeyPanelMiddleware, async(req, res, next) => {
    try{
        const {branch_id, message} = req.body;
        const branchStatus = await BranchStatus.findOneAndUpdate({branch_id: branch_id},{
            status: false,
            message: message,
        });
        res.json({
            data: branchStatus,
            status: {
                state: true,
                code: 'UB_1'
            }
        });
    }catch(e){
        res.json({
            data: e,
            status: {
                state: true,
                code: 'UB_0'
            }
        });
    }
});

router.delete('/', apikeyPanelMiddleware, async(req, res, next) => {
    try{
        await BranchStatus.deleteOne({branch_id: req.body.branch_id});
        res.json({});
    }catch(e){
        res.json(e);
    }
})

module.exports = router;
