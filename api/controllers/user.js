var mongoose = require('mongoose')
    , User = mongoose.model('User')
    , logger = require('../logger')
    , sugar = require('sugar')
;
/**
 * Manage Error Mongoose
 * @param err
 * @returns {string}
 */
var getErrorMessage = function (err) {
    var message = '';
    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'User already exists';
                logger.error('%s', message);
                break;
            default:
                message = 'Something went wrong';
                logger.error('%s', message);
        }
    } else {
        for (var errName in err.errors) {
            if (err.errors[errName].message) {
                message = err.errors[errName].message;
                logger.error('%s', message);
            }
        }
    }

    return message;
};

// CREATE
// =============================================================================

exports.createUser = function (req, res) {

    User.create(req.body, function (err, user) {
        if (err) {
            return res.send(400, {
                message : getErrorMessage(err)
            });
        } else {
            logger.info('User created and saved: %s', user);
            res.send(200, {
                message : 'User created and saved! ' + user
            });
        }
    });
};


// READ
// =============================================================================

exports.getUsers = function (req, res) {
    User.find(function (err, users) {
        if (err) {
            logger.error('getUsers ', err);

            return res.send(400, {
                message : getErrorMessage(err)
            });
        } else {
            logger.info('getUsers ', users);
            res.send(200, {
                users : users
            });
        }
    });
};



