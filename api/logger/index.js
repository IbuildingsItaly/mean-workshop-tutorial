var bunyan = require("bunyan"); // Bunyan dependency
var logger = bunyan.createLogger({name: "myLogger"});

module.exports = logger;