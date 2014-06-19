var mongoose = require('mongoose')
    , Plan = mongoose.model('Plan')
    , logger = require('../logger')
    , sugar = require('sugar')
    , jwt = require('jwt-simple')
    , authorization = require('../config/authorization');


/**
 * Cè un modo per far passare la chiamata sempre da un middleware per verifica che l'utente sia loggato?
 * @param req
 * @param res
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

// CREATE
// =============================================================================

exports.createPlan = function (req, res) {
    var token = req.headers.authorization;
    var userData = jwt.decode(token, authorization.secret);
    var objSave = req.body;
    objSave.owner = userData._id;
    Plan.create(objSave, function (err, plan) {
        if (err) {
            return res.send(400, {
                message : getErrorMessage(err)
            });
        } else {
            logger.info('Plan created and saved: %s', plan);
            res.json(plan.toJSON());
        }
    });
};


// READ
// =============================================================================

//all Plans of user
exports.index = function (req, res) {
    var token = req.headers.authorization;
    if (token) {
        var userData = jwt.decode(token, authorization.secret);

        Plan.find({owner : userData._id}).populate('owner', 'email username').sort({createdOn : -1}).exec(function (err, plans) {
            if (err) {
                return res.send(400, {
                    message : getErrorMessage(err)
                });
            } else {
                var obj = {};
                plans.forEach(function (plan) {
                    obj[plan._id] = plan;
                });
                res.json(obj);
            }
        });
    } else {
        res.send(401, {message : 'Not unAuthorized'});
    }
};


exports.plan = function (req, res) {
    var token = req.headers.authorization;
    if (token) {
        var token = req.headers.authorization;
        var userData = jwt.decode(token, authorization.secret);

        Plan.findOne({_id:req.params.id,owner : userData._id}).populate('owner', 'email username').sort({createdOn : -1}).exec(function (err, plan) {
            if (err) {
                return res.send(400, {
                    message : getErrorMessage(err)
                });
            } else {
                res.json(plan);
            }
        });
    } else {
        res.send(401, {message : 'Not unAuthorized'});
    }
};


// UPDATE
// =============================================================================

exports.updatePlan = function (req, res) {
    console.dir(req.body); //PARAMETRI NEL CORPO
    console.log(req.params.id); //QUELLI DELL URL id => al parametro fuori

    var token = req.headers.authorization;
    var userData = jwt.decode(token, authorization.secret);

    Plan.findOne({_id : req.params.id, owner : userData._id}).populate('owner', '_id username').exec(function (err, plan) {
        if (err) {
            logger.error('update plan ', err);
            return res.send(400, {
                message : getErrorMessage(err)
            });
        }
        if (!plan) {
            logger.warn('plan Not Found');
            res.send(200, {
                message : 'plan Not Found'
            });
        } else {
            plan = Object.merge(plan, req.body)
            plan.save(function (err) {
                if (err) {
                    logger.error('update plan ', err);
                    return res.send(400, {
                        message : getErrorMessage(err)
                    });
                }
                logger.info('update plan ', plan);
                res.send(200, {
                    sucess : true,
                    plan   : plan
                });
            });
        }
    });
}


// DELETE
// =============================================================================
exports.deletePlan = function (req, res) {
    var token = req.headers.authorization;
    var userData = jwt.decode(token, authorization.secret);

    //Id del Piano
    Plan.findByIdAndRemove(req.params.id, function (err, plan) {
            if (err) {
                logger.error('delete plan ', err);
                return res.send(400, {
                    message : getErrorMessage(err)
                });
            }

            if (!plan) {
                logger.warn('plan Not Found');
                res.send(200, {
                    message : 'plan Not Found'
                });

            } else {
                logger.info('deleteplan ', plan.title);
                res.send(200, {
                    message : plan.title + ' deleted'
                });
            }
        }
    )
}

exports.deleteAllplans = function (req, res) {
    Plan.remove(function (err, plan) {
            if (err) {
                logger.error('deleteUser ', err);
                return res.send(400, {
                    message : getErrorMessage(err)
                });
            }
            if (!plan) {
                logger.warn('Plan not Found');
                res.send(200, {
                    message : 'Plan not Found'
                });
            } else {
                logger.info('all Plan removed ', plan);
                res.send(200, {
                    message : plan + " Plan removed"
                });
            }
        }
    )
}
