const { debug } = require('debug');
const http = require('http');
const app = require('./app');
const port = process.env.PORT || 3000;

const normalizePort = val => {
    var port = parseInt(val, 10);
    if(isNaN(port)){
        return value;
    }

    if(port >= 0){
        return port;
    }
    return false;
}

const onError = error => {
    if(error.syscall !== "listen"){
        throw error;
    }

    const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
    switch(error.code) {
        case "EACES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}

const onListening = () => {
    const address = server.address();
    const bind = typeof add === "string" ? "pipe " + addr : "port " + port;
    debug("Listening on " + bind);
}

app.set('port', port);
const server = http.createServer(app);
server.on("listening", onListening);
server.on("error", onError);
server.listen(normalizePort(port));