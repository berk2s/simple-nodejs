const socketio = require('socket.io');
const io = socketio();

const socketApi = {};

socketApi.io = io;

io.on('connection', (socket) => {
    console.log('baglandi')
});

module.exports = socketApi;
