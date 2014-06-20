var bunyan = require("bunyan");
var logger = bunyan.createLogger({name: "myLogger"});

module.exports = logger;