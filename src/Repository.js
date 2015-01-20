'use strict';

var Q = require('q');

var UserAgent = require('./UserAgent');
var Utils = require('./Utils');

class Repository {
    constructor() {
        this.ua = new UserAgent({
            rootUrl: "/api/v1/"
        });
    }

    getProjects() {
        return this.ua.get('projects').then(function(data) {
            return data.status == 1 ? data.projects : Q.reject(data);
        });
    }

    getUsers(users) {
        var url = 'users';

        var usersParam = Utils.arrToRequestString('users', users);
        url += usersParam ? '?' + usersParam : '';

        return this.ua.get(url).then(function(data) {
            return data.status == 1 ? data.users : Q.reject(data);
        });
    }

    getTimeEntries(params) {
        params = params ? params + '&' : '';
        var url = 'time_entries?' + params + 'include=user';

        return this.ua.get(url).then(function(data) {
            return data.status == 1 ? data : Q.reject(data);
        });
    }
}

module.exports = Repository;