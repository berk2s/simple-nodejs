const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const moment = require('moment-timezone');
const dateTurkey = moment.tz(Date.now(), "Europe/Istanbul");

const UserModel = new Schema({
    name_surname:{
        type:String,
        required:[true, 'Lütfen ad soyad girin']
    },
    email_address:{
        type:String,
        unique:true,
        required:[true, 'Lütfen e-posta girin']
    },
    phone_number:{
        type:String,
        unique:true,
        required:[true, 'Lütfen telefon numarasi girin'],
        minlength:[10, 'Lütfen gercek numara girin'],
        maxLength:[11, 'Lütfen gercek numara girin'],
    },
    password:{
        type:String,
        unique:true,
        required:[true, 'Lütfen şifre girin']
    },
    which_platform:{
        type:String
    },
    is_confirmed:{
        type:Boolean,
        default:false
    },
    permission_email:{
        type:Boolean,
        default:true
    },
    permission_sms:{
        type:Boolean,
        default:true
    },
    token:{
        type:String,
        default:null
    },
    createdAt:{
        type:Date,
        default:dateTurkey._d
    }
});

module.exports = mongoose.model('User', UserModel)
