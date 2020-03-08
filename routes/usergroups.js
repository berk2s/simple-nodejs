const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const UserGroups = require('../Models/UserGroups');

//cors
var cors = require("cors");

var corsOptions = {
    origin: PANEL_URL,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

router.get('/', cors(corsOptions), async(req, res, next) => {
   try{

       const groups = await UserGroups.find();

       res.json({
           data: groups,
           state:{
               status:true,
               code:'FG_1'
           }
       });

   }catch(e){
       res.json(e);
   }
});

router.post('/', cors(corsOptions), async (req, res, next) => {
    try{
        const {group_name, group_desc, group_branch, group_users} = req.body;
        const newGroup = new UserGroups({
           group_name:group_name,
           group_desc:group_desc,
           group_branch:group_branch,
           group_users:group_users
        });
        const saveGroup = await newGroup.save();
        res.json({
            data: saveGroup,
            state:{
                status:true,
                code:'IG_1'
            }
        });
    }catch(e){
        res.json(e);
    }
})

module.exports = mongoose;
