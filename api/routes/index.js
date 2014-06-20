/**
 * Import all Route
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
        //Delete All Plans
        .delete(planController.deleteAllplans)

    router.route('/plans/:id')
        .get(planController.plan)
        // Update Plan
        .put(planController.updatePlan)
        // Delete Plan
        .delete(planController.deletePlan)


    // EVENT
    // =============================================================================
    router.route('/plans/:id/events')
        //get All Plans
        .get(eventsController.events)
        //Create Event
        .post(eventsController.createEvent)
        //Delete All Events
        .delete(eventsController.deleteAllEvents)

    router.route('/plans/:id/events/:eventId')
        //get All Plans
        .get(eventsController.getEvent)
        // Update Event
        .put(eventsController.updateEvent)
        // Delete Event
        .delete(eventsController.deleteEvent)
};