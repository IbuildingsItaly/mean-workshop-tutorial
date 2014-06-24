'use strict';

var jwt = require('jwt-simple')
	, tokenSecret = require('../config/authorization');

module.exports = function (tokenSecret) {
    return function (req, res, next) {
		var token;

    	if(req.body&&req.body.token){
        	req.token = jwt.decode(req.body.token, tokenSecret);
		}else{
        	delete req.token;
		}

		next();
    };
};