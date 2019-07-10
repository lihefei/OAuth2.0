const UserController = require('./user');
class Controllers {
    static get user() {
        return UserController;
    }
}

module.exports = Controllers;
