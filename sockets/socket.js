const {io} = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();
console.log('init server');

bands.addBand( new Band('Queen'));
bands.addBand( new Band('Green day'));
bands.addBand( new Band('Metallica'));
bands.addBand( new Band('Pop'));


//Mensajes de sockets
io.on('connection', client => {
    console.log('cliente conectado');

    client.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

});
