var mongoose = require('mongoose')
    , User = mongoose.model('User')
    , logger = require('../logger')
    , sugar = require('sugar')
    , _ = require('lodash')
    , jwt = require('jwt-simple')
    , crypto = require('crypto')
    , passport = require('../helpers/auth')(User)
    , authorization = require('../config/authorization');

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

var clearSession = function (session, callback) {
    session.destroy();
    callback();
};


// CREATE
// =============================================================================

exports.createUser = function (req, res) {
    var md5sum = crypto.createHash('md5');
    
    if (req.body.password){
        // MD5 of the password 
        req.body.password = md5sum.update(req.body.password).digest('hex');
    }else{
        return res.send(400, {
            message : 'Some fields are missing'
        }); 
    }

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

// UPDATE
// =============================================================================

/**
 * For use mongoose validation, You have to retrieve the user object from Database
 * Then call save
 * Update doesn't do Validation Scema
 * use sugar library http://sugarjs.com/api/Object/merge
 * @param req
 * @param res
 */
exports.updateUser = function (req, res) {
    var username = req.params.nome;
    username = username.replace(/\s/g, '_');
    username = username.toLowerCase();
    User.findOne({username : username}, function (err, user) {
            if (err) {
                logger.error('update User ', err);
                return res.send(400, {
                    message : getErrorMessage(err)
                });
            }
            if (!user) {
                logger.warn('User Not Found');
                res.send(200, {
                    message : 'User Not Found'
                });
            } else {

                user = Object.merge(user, req.body)
                user.save(function (err) {
                    if (err) {
                        logger.error('update User ', err);
                        return res.send(400, {
                            message : getErrorMessage(err)
                        });
                    }
                    logger.info('update User ', user);
                    res.send(200, {
                        user : user
                    });
                });
            }
        }
    )

}

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

exports.getUser = function (req, res) {
    var username = req.params.nome;
    username = username.replace(/\s/g, '_');
    username = username.toLowerCase();
    User.findOne({username : username}, function (err, user) {
            if (err) {
                logger.error('getUser ', err);
                return res.send(400, {
                    message : getErrorMessage(err)
                });
            }
            if (!user) {
                logger.warn('User not Found');
                res.send(200, {
                    message : 'User not Found'
                });
            } else {
                logger.info('get user ', user);
                res.send(200, {
                    user : user
                });
            }
        }
    )
}


// DELETE
// =============================================================================

exports.deleteUser = function (req, res) {
    var username = req.params.nome;
    username = username.replace(/\s/g, '_');
    username = username.toLowerCase();
    User.findOneAndRemove({username : username}, function (err, user) {
            console.log("---dentro-----")
            console.dir(user);
            console.log("--------")
            if (err) {
                logger.error('deleteUser ', err);
                return res.send(400, {
                    message : getErrorMessage(err)
                });
            }

            logger.info('deleteUser ', user);
            clearSession(req, function () {
                res.send(200, {
                    message : username + ' eliminato'
                });
            });
        }
    )
}

exports.allUsers = function (req, res) {
    User.remove(function (err, user) {
            if (err) {
                logger.error('deleteUser ', err);
                return res.send(400, {
                    message : getErrorMessage(err)
                });
            }
            if (!user) {
                logger.warn('Users not Found');
                res.send(200, {
                    message : 'Users not Found'
                });
            } else {
                logger.info('all users removed ', user);
                res.send(200, {
                    message : user + " users removed"
                });
            }
        }
    )
}


// LOGIN / LOGOUT
// =============================================================================

exports.login = function (req, res) {
    // if (req.body.email && req.body.password) {

        passport.authenticate('local', function (err, user, info) {
            var token;

            if (err) {
                logger.info(prefix + 'Attempt a login, obtained an error: ' +  err.toString());
                return res
                .status(400)
                .json({success: false});
            }

            if (_.isEmpty(user)) {
                logger.info('Login failed for user ' + req.body.username);
                return res
                    .status(200)
                    .json({'status': 'failure', error: 'AUTH Failed', success: false });
            }

            //user has authenticated correctly thus we create a JWT token
            token = jwt.encode(user, authorization.secret, 'HS256');
            _.extend(user, {token: token, success: true});

            return res
                .status(200)
                .json({user: user, token: token, success: true});

        })(req, res);
    // }
}


exports.logout = function (req, res) {
    clearSession(req.session, function () {
        res.send(200, {
            message : 'utente sloggato'
        });
    });
}