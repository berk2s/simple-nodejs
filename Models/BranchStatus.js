const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const moment = require('moment-timezone');
const dateTurkey = moment.tz(Date.now(), "Europe/Istanbul");

const BranchStatus = new Schema({
    status_id: mongoose.Types.ObjectId,
    branch_id: {
        type:Number
    },
    status: {
        type: Boolean,
        default:true,
    },
    message:{
        type: String,
        default:'Üzgünüz, çalışma saatlerimizin dışındayız.'
    },
    process_date:{
        type:Date,
        default:dateTurkey._d
    },
});

module.exports = mongoose.model('BranchStatus', BranchStatus);
