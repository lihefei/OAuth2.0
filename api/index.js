const api = {
    user: {
        register: '/api/register',
        login: '/api/login',
        getAppName: '/api/getAppName'
    },
    application: {
        add: '/api/application/add',
        list: '/api/application/list'
    },
    authorize: {
        token: '/api/authorize/token'
    }
};

module.exports = api;
