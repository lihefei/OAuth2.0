const UserController = require('./user');
const ApplicationController = require('./application');
class Controllers {
    static get user() {
        return UserController;
    }
    static get application() {
        return ApplicationController;
    }
}

module.exports = Controllers;
