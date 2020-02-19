const mongoose = require('mongoose');

module.exports = () => {

    mongoose.connect('mongodb://mavideniste_dba:jvA6kCDZ!8CGy98@ds259111.mlab.com:59111/heroku_4lcm1msg', {  useUnifiedTopology: true , useNewUrlParser: true } )

    mongoose.connection
        .on('open', () => {
            console.log('MongoDB connection is succesfull!')
        })
        .on('error', (err) => {
            console.log(err);
        })
}
