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
            if (err) {
                logger.error('deleteUser ', err);
                return res.send(400, {
                    message : getErrorMessage(err)
                });
            }

            logger.info('deleteUser ', user);
            res.send(200, {
                message : username + ' eliminato'
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

