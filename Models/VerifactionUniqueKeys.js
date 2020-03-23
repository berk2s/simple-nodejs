const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VerifactionUniqueKeysSchema = new Schema({
    key:Number,
    phone_number:String,
    code:Number,
    type:Number, // 1 = new user, 2 = forgot pass
});

module.exports = mongoose.model('VerifactionKeys', VerifactionUniqueKeysSchema);

