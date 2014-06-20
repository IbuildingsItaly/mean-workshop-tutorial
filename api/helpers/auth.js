var mongoose = require('mongoose')
    , User = mongoose.model('User')
	, passport = require('passport')
	, LocalStrategy = require('passport-local').Strategy
	, crypto = require('crypto')
    , logger = require("../logger");

/**
 * This function performs the authentication of the user stored in the MongoDB
 *
 * @param UserModel
 * @returns {*|exports}
 */
module.exports = function (User) {

	passport.use(new LocalStrategy(

		function (username, password, done) {
			var md5sum = crypto.createHash('md5'),
				email = '';
	        User.findOne({username: username, password: md5sum.update(password).digest('hex')}, function (err, user) {
	            if (err) {
	                logger.error('loginUser ', err);
	                return done(false);
	            }
	            if (!user) {
	                logger.warn('Users not Found');
	                return done(false);
	            } else {
	                User.update({username: username, password: password}, { $set : {lastLogin : Date.now()} }, function () {
	                    return done(null, user)
	                });
	            }
	        })

		}
	));

	/**
	 * With this function I serialize the user data which will be available in the session
	 */
	passport.serializeUser(function (user, done) {
		return done(null, user.id, user.username, user.email, user.createdOn, user.lastLogin);
	});

	/**
	 * This deserializes the user data
	 */
	passport.deserializeUser(function (username, done) {
		return done(null, {
			id: user.id,
            username: user.username,
			email: user.email,
			createdOn: user.createdOn,
			lastLogin: user.lastLogin
		});
	});


	return passport;
};