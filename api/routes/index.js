/**
 * Import all Route
 */
var userController = require('../controllers/user');

module.exports = function (router) {

    // USERS
    // =============================================================================

    router.route('/user')

        // Create User
        .post(userController.createUser)

        // get All Users
        .get(userController.getUsers)
}

