const fs = require('fs');
const path = require('path');
const url = require('url');
var http = require('http'); // 1 - Import Node.js core module

const ioServer = require('socket.io');
const RTCMultiConnectionServer = require('rtcmulticonnection-server');

var PORT = 9001;
var uri, filename;

const jsonPath = {
    config: 'config.json',
    logs: 'logs.json'
};

const BASH_COLORS_HELPER = RTCMultiConnectionServer.BASH_COLORS_HELPER;
const getValuesFromConfigJson = RTCMultiConnectionServer.getValuesFromConfigJson;
const getBashParameters = RTCMultiConnectionServer.getBashParameters;
const resolveURL = RTCMultiConnectionServer.resolveURL;

var config = getValuesFromConfigJson(jsonPath);
config = getBashParameters(config, BASH_COLORS_HELPER);

var server = http.createServer(function (request, response) {   // 2 - creating server
	uri = url.parse(request.url).pathname;
	filename = path.join(process.cwd(), uri);
	
	console.log(uri);
	console.log(filename);
	
	try {
		var contentType = 'text/plain';
        if (filename.toLowerCase().indexOf('.html') !== -1) {
            contentType = 'text/html';
        }
        if (filename.toLowerCase().indexOf('.css') !== -1) {
            contentType = 'text/css';
        }
        if (filename.toLowerCase().indexOf('.png') !== -1) {
            contentType = 'image/png';
        }

        fs.readFile(filename, 'binary', function(err, file) {
            if (err) {
                response.writeHead(500, {
                    'Content-Type': 'text/plain'
                });
                response.write('404 Not Found: ' + path.join('/', uri) + '\n');
                response.end();
                return;
            }

            try {
                file = file.replace('connection.socketURL = \'/\';', 'connection.socketURL = \'' + config.socketURL + '\';');
            } catch (e) {}

            response.writeHead(200, {
                'Content-Type': contentType
            });
            response.write(file, 'binary');
            response.end();
        });	
	} catch (e) {
        pushLogs(config, 'Unexpected', e);

        response.writeHead(404, {
            'Content-Type': 'text/plain'
        });
        response.write('404 Not Found: Unexpected error.\n' + e.message + '\n\n' + e.stack);
        response.end();
    }

});


RTCMultiConnectionServer.beforeHttpListen(server, config);


server.listen(PORT, function(){
	RTCMultiConnectionServer.afterHttpListen(server, config);
}); //3 - listen for any incoming requests

console.log('Node.js web server at port ' + PORT + ' is running..')

var cors_config = {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  }
};

ioServer(server, cors_config).on('connection', function(socket) {
    RTCMultiConnectionServer.addSocket(socket, config);

    // ----------------------
    // below code is optional

    const params = socket.handshake.query;

    if (!params.socketCustomEvent) {
        params.socketCustomEvent = 'custom-message';
    }

    socket.on(params.socketCustomEvent, function(message) {
        socket.broadcast.emit(params.socketCustomEvent, message);
    });
});