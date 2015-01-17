'use strict';

var Q = require('q');
var $ = require('jquery');
var _ = require('lodash');

class UserAgent {
    constructor(args) {
        if (!args.rootUrl) throw "rootUrl required";

        this.rootUrl = args.rootUrl;
    }

    get(url) {
        return this.request({
            url: url,
            method: 'GET'
        });
    }

    post(url, data) {
        return this.request({
            url: url,
            method: 'POST',
            data: JSON.stringify(data),
        });
    }

    put(url, data) {
        return this.request({
            url: url,
            method: 'PUT',
            data: JSON.stringify(data)
        });
    }

    del(url) {
        return this.request({
            url: url,
            method: 'DELETE'
        });
    }

    request(options) {
        options.url = this.rootUrl + options.url;

        _.extend(options, {
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            cache: false,
            contentType: 'application/json; charset=utf-8'
        });

        return Q($.ajax(options)).catch(function(data) {
            console.error('fail:', data);
        });
    }
}

module.exports = UserAgent;