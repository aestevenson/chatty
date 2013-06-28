var app = require('http').createServer(handler),
    io = require('socket.io').listen(app, {log:false}),
    fs = require('fs'),
    os = require('os'),
    port = process.env.PORT || 4444;

io.configure(function () {
    io.set("transports", ["xhr-polling"]);
    io.set("polling duration", 10);
});

app.listen(port);

console.log("Grab your ip from here:");
console.log(os.networkInterfaces());

function handler(req, res) {
    if (req.url.indexOf("/app/") > -1) {
        fs.readFile(__dirname + '/..' + req.url, function (err, data) {
            if (req.url.indexOf("css") > -1) {
                res.setHeader('Content-Type', 'text/css');
            } else {
                res.setHeader('Content-Type', 'text/javascript');
            }

            res.writeHead(200);
            res.end(data);
        });
    } else {
        fs.readFile(__dirname + '/../app/index.html',
            function (err, data) {
                if (err) {
                    res.writeHead(500);
                    res.end('Error loading index.html');
                } else {
                    res.writeHead(200);
                    res.end(data);
                }
            });
    }
}

var messageHistory = {
    messages: [],
    maxHistory: 50,
    add: function (data) {
        this.messages.push(data);
        if (this.messages.length > this.maxHistory) {
            this.messages.shift();
        }
    },
    size: function () {
        return this.messages.length;
    }
};

// keep a running list of the current connections
var socketManager = {
    sockets: [],
    lastCount : null,
    connections: {},
    rooms : {
        'default' : []
    },
    count : function() {
//        var currentCount = Object.keys(socketManager.connections).length;
//        if (this.lastCount === currentCount)
//        {
//            return;
//        }
//        console.log("Emitting Count:",this.lastCount);
//        this.lastCount = currentCount;

        this.emit('count', {'count': Object.keys(socketManager.connections).length});
    },
    add: function (socket) {
        this.sockets.push(socket);
        this.count();
    },
    remove: function (socket) {
        for (var i = 0; i < this.sockets.length; i++) {
            if (this.sockets[i].id === socket.id) {
                this.sockets.splice(i, 1);
                console.log(this.sockets);
            }
        }
        this.count();
    },
    emit: function (key, data) {
        for (var i = 0; i < this.sockets.length; i++) {
            this.sockets[i].emit(key, data);
        }

    },
    size: function () {
        return this.sockets.length;
    }
};

io.sockets.on('connection', function (socket) {

    socketManager.connections[socket.handshake.address.address] = "";
    console.log("socketManager",socketManager.connections);

    socketManager.add(socket);
    // welcome message
    socket.emit('message', { name: "Server", text: 'Welcome!'});

    if (messageHistory.size() > 0) {
        socket.emit('history', messageHistory.messages);
    }

    //TODO: wtf is this?
    if (socketManager.size() > -10) {
        socketManager.count();
    }

    socket.on('message', function (data) {
        messageHistory.add(data);
        socketManager.emit("message", data);
    });
    socket.on('disconnect', function (/*data*/) {
        delete socketManager[socket.handshake.address.address];
        socketManager.remove(socket);
    });
});