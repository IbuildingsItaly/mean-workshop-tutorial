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


    router.route('/user/:nome')
        // get specific User
        .get(userController.getUser)

        // delete the bear with name
        .delete(userController.deleteUser)

        // update user with this name
        .put(userController.updateUser)

    //clears the entire collection
    router.route('/userDestroy')
        .delete(userController.allUsers)

    router.route('/login')
        .post(userController.login)

    router.route('/logout')
        .get(userController.logout)

}

