var mongoose = require('mongoose')
    , Plan = mongoose.model('Plan')
    , logger = require('../logger')
    , sugar = require('sugar')
    , jwt = require('jwt-simple')
    , authorization = require('../config/authorization');

/**
 * Manage Error
 * @param err
 * @returns {string}
 */
var getErrorMessage = function (err) {
    var message = '';
    logger.error('err: %s', err);
    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'Plan already exists';
                logger.error('%s', message);
                break;
            default:
                message = 'Something went wrong';
                logger.error('%s', message);
        }
    } else {
        if (Object.has(err, 'errors')) {
            for (var errName in err.errors) {
                if (err.errors[errName].message) {
                    message = err.errors[errName].message;
                    logger.error('%s', message);
                }
            }
        } else {
            logger.error('%s', err.message);
            message = 'Something went wrong!';
        }
    }

    return message;
}


// EVENTS
// subdocuments
// =============================================================================

// CREATE
// =============================================================================
exports.createEvent = function (req, res) {

    var token = req.headers.authorization;
    if (token) {
        var userData = jwt.decode(token, authorization.secret);

        Plan.findById(req.params.id, 'events', function (err, plan) {
            if (!err) {
                plan.events.push(req.body);
                plan.save(function (err, plan) {
                    if (err) {
                        logger.error('create events ', err);
                        return res.send(400, {
                            message : getErrorMessage(err)
                        });
                    } else {
                        console.log('events saved: ' + req.body.title);
                        res.json(plan.events[plan.events.length - 1].toJSON());
                    }
                });
            }
        });
    }
}


// READ
// =============================================================================
exports.events = function (req, res) {
    var token = req.headers.authorization;
    if (token) {
        var userData = jwt.decode(token, authorization.secret);
        Plan.find({_id : req.params.id, owner : userData._id}, 'events').sort({createdOn : -1}).exec(function (err, plan) {
            if (err) {
                return res.send(400, {
                    message : getErrorMessage(err)
                });
            } else {
//            console.log(plan);
                res.send(200, {events : plan});
            }
        });
    }
};

exports.getEvent = function (req, res) {
    var token = req.headers.authorization;
    if (token) {
        var userData = jwt.decode(token, authorization.secret);
        Plan.findOne({_id : req.params.id, owner : userData._id}, 'events').sort({createdOn : -1}).exec(function (err, plan) {
            if (err) {
                return res.send(400, {
                    message : getErrorMessage(err)
                });
            } else {
                var thisEvents = plan.events.id(req.params.eventId);
                console.dir(plan.events[0]);
                res.json(plan.events[0]);
            }
        });
    }
};


// UPDATE
// =============================================================================
exports.updateEvent = function (req, res) {
    var token = req.headers.authorization;
    if (token) {
        var userData = jwt.decode(token, authorization.secret);
        Plan.findOne({_id : req.params.id, owner : userData._id}, 'events').sort({createdOn : -1}).exec(function (err, plan) {
            if (err) {
                return res.send(400, {
                    message : getErrorMessage(err)
                });
            } else {
                var thisEvents = plan.events.id(req.params.eventId);
                Object.merge(thisEvents, req.body)
                plan.save(function (err, plan) {
                    if (err) {
                        logger.error('create events ', err);
                        return res.send(400, {
                            message : getErrorMessage(err)
                        });
                    } else {
                        console.log('events saved: ' + req.body.title);
                        console.dir(plan);
                        res.json(plan.events[0]);
                    }
                });
            }
        });
    }
};
// DELETE
// =============================================================================

exports.deleteEvent = function (req, res) {
    var token = req.headers.authorization;
    if (token) {
        var userData = jwt.decode(token, authorization.secret);

        Plan.findOne({_id : req.params.id, owner : userData._id}, 'events').sort({createdOn : -1}).exec(function (err, plan) {
            if (err) {
                return res.send(400, {
                    message : getErrorMessage(err)
                });
            } else {
                if (plan.events.length > 0) {

                    var thisEvents = plan.events.id(req.params.eventId).remove();
                    plan.save(function (err, plan) {
                        if (err) {
                            logger.error('create events ', err);
                            return res.send(400, {
                                message : getErrorMessage(err)
                            });
                        } else {
                            console.log('events removed: ' + req.body.title);
                            res.send(200, {
                                message : req.body.title + " removed"
                            });
                        }
                    });
                } else {
                    res.send(200, {
                        message : "No Events for this Plan"
                    });
                }
            }
        });
    }
};


exports.deleteAllEvents = function (req, res) {
    var token = req.headers.authorization;
    if (token) {

        var userData = jwt.decode(token, authorization.secret);

        Plan.findOne({_id : req.params.id, owner : userData._id}, 'events').sort({createdOn : -1}).exec(function (err, plan) {
            if (err) {
                return res.send(400, {
                    message : getErrorMessage(err)
                });
            } else {
                plan.events = [];
                plan.save(function (err, plan) {
                    if (err) {
                        logger.error('create events ', err);
                        return res.send(400, {
                            message : getErrorMessage(err)
                        });
                    } else {
                        console.log('events removed: ' + req.body.title);
                        res.send(200, {
                            message : req.body.title + " removed"
                        });
                    }
                });
            }
        });
    }
};