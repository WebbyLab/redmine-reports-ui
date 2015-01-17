'use strict';
var Moment = require('moment');

var _ = require('lodash');
var querystring = require('querystring');

module.exports = {
    arrToRequestString: function(name, arr) {
        if (arr) {
            var res = name + '=';
            res += _.isArray(arr) ? arr.join(',') : arr;
            return res;
        } else {
            return '';
        }
    },

    requestStringToObject: function(queryString) {
        if (!queryString) {
            return {};
        }

        var params = querystring.parse(queryString);
        return {
            projects: (params.projects ? params.projects.split(',') : []),
            users: (params.users ? params.users.split(',') : []),
            startDate: params.startDate,
            endDate: params.endDate
        };
    },

    getWeekDates: function() {
        var today = new Date();
        var startWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1));
        var endWeek = new Date(today.setDate(startWeek.getDate() + 6)).toUTCString();
        return {
            startDate: this.formatDateToString(startWeek),
            endDate: this.formatDateToString(endWeek)
        };
    },

    formatDateToString: function(data) {
        return Moment(data).format('YYYY-MM-DD');
    },

    formatStringToDate: function(str) {
        var parts = str.split('-');
        return new Date(parts[0], parts[2] - 1, parts[1]); //please put attention to the month
    }
};