/**
 * Import all Route
 *
 */
var userController = require('../controllers/user');
var planController = require('../controllers/plan');
var eventsController = require('../controllers/events');

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


    // PLAN
    // =============================================================================
    router.route('/plans')

        //get All Plans
        .get(planController.index)

        //create Plan
        .post(planController.createPlan)

        .delete(planController.deleteAllplans)

    router.route('/plans/:id')
        .get(planController.plan)
    // update plan By Id
        .put(planController.updatePlan)
    // Put plan By Id
        .delete(planController.deletePlan)


    // EVENT
    // =============================================================================
    /**
     /plans/:planId/events GET, POST
     /plans/:planId/events/:eventId GET, PUT, DELETE
     */

    router.route('/plans/:id/events')

        //get All Plans
        .get(eventsController.events)

        //get All Plans
        .post(eventsController.createEvent)
        //create Plan
        .delete(eventsController.deleteAllEvents)

    router.route('/plans/:id/events/:eventId')
        // update plan By Id
        .put(eventsController.updateEvent)
        // Put plan By Id
        .delete(eventsController.deleteEvent)



};
