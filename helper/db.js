const mongoose = require('mongoose');

module.exports = () => {

//    mongoose.connect('mongodb://mavideniste_dba:jvA6kCDZ!8CGy98@ds259111.mlab.com:59111/heroku_4lcm1msg', {  useUnifiedTopology: true , useNewUrlParser: true } )

    //mongodb+srv://mavideniste_dba:jvA6kCDZ!8CGy98@cluster-4lcm1msg.4ute3.mongodb.net/heroku_4lcm1msg?retryWrites=true&w=majority

    mongoose.connect('mongodb+srv://mavideniste_dba:jvA6kCDZ!8CGy98@cluster-4lcm1msg.4ute3.mongodb.net/heroku_4lcm1msg?retryWrites=true&w=majority', {  useUnifiedTopology: true , useNewUrlParser: true } )


    //nslookup -type=SRV _mongodb._tcp.cluster-4lcm1msg.4ute3.mongodb.net
    //mongodb://heroku_4lcm1msg:7ifgc966h2mrfcb23t7g9414p2@ds259111.mlab.com:59111/heroku_4lcm1msg

    // last one

    //mongodb+srv://mavideniste_dba:jvA6kCDZ!8CGy98@cluster-4lcm1msg.4ute3.mongodb.net/heroku_4lcm1msg?retryWrites=true&w=majority

    mongoose.connection
        .on('open', () => {
            console.log('MongoDB connection is succesfull!')
        })
        .on('error', (err) => {
            console.log(err);
        })
}


