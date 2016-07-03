var express = require('express'),
    app = express(),
    server = require('http').createServer(app);

var config = {
    rootPath : __dirname
};

require('./server/config/express')(app, config);

require('./server/config/routes')(app);

var port = process.env.port || 1337;
server.listen(port, function () {
    console.log("Servidor corriendo en el puerto: " + port);
});