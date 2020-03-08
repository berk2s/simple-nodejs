const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const moment = require('moment-timezone');
const dateTurkey = moment.tz(Date.now(), "Europe/Istanbul");

const UserGroupsModel = new Schema({
    group_name:{
        type:String
    },
    group_desc:{
        type:String
    },
    group_branch:{
        type:Number
    },
    group_users:[],
    group_date:{
        type:Date,
        default:dateTurkey._d
    },
});

module.exports = mongoose.model('UserGroups', UserGroupsModel);
