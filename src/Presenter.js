'use strict';

var Utils = require('./Utils');
var Q = require('q');
var _ = require('lodash');
var Moment = require('moment');
var querystring = require('querystring');

class Presenter {
    constructor(args) {
        if (!args.repository) throw "repository required";
        if (!args.ui) throw "ui required";
        if (!args.pubsub) throw "pubsub required";

        this.repository = args.repository;
        this.ui = args.ui;
        this.pubsub = args.pubsub;
    }

    updateHeaderData() {
        var projectPromise = this.repository.getProjects().then(function(data) {
            return _.map(data, function(val) {
                val.text = val.name;
                return val;
            });
        });
        var userPromise = this.repository.getUsers().then(function(data) {
            return _.map(data, function(val) {
                val.text = val.name;
                return val;
            });
        });

        this.ui.setState({
            headerData: {
                projectPromise: projectPromise,
                userPromise: userPromise
            }
        });
    }

    updateUrl(users=[], projects=[], startDate=null, endDate=null) {
        if (!startDate && !endDate) {
            var weekDates = Utils.getWeekDates();
            startDate = weekDates.startDate;
            endDate =  Moment().format('YYYY-MM-DD');
        } else if (!startDate) {
            var a = Utils.formatStringToDate(endDate);
            startDate = new Date(a.setDate(a.getDate() - 7));
            startDate = Moment(startDate).format('YYYY-MM-DD');
        } else if (!endDate) {
            endDate = Moment().format('YYYY-MM-DD');
        }

        var url = querystring.stringify({
            users: users.join(','),
            projects: projects.join(','),
            startDate: startDate,
            endDate: endDate
        });

        this.router.navigate(url);
    }

    filter(queryString) {
        var params = Utils.requestStringToObject(queryString);
        if (!params.startDate && !params.endDate) {
            var weekDates = Utils.getWeekDates();
            params.startDate = weekDates.startDate;
            params.endDate = Moment().format('YYYY-MM-DD');
            queryString = querystring.stringify(params);
            this.router.navigate(queryString);
            return;
        }

        var self = this;

        Q([this.repository.getTimeEntries(queryString),
               this.repository.getProjects()]).spread(function(resp,projects) {
            var headerData = self.ui.state.headerData;
            headerData.defaults = Utils.requestStringToObject(queryString);
            self.ui.setState({
                headerData: headerData,
                userIsueChartData: self._getDataForUserIssueChart.call(self, resp.linked.users, resp.timeEntries),
                userActivityChartData: self._getDataForUserActivityChart.call(self, resp.linked.users, resp.timeEntries),
                userProjectChartData: self._getDataForUserProjectChart.call(self, resp.linked.users, resp.timeEntries, projects),
                totalActivityChartData: self._getDataForTotalActivityChart.call(self, resp.timeEntries),
                totalProjectChartData: self._getDataForTotalProjectChart.call(self, resp.timeEntries, projects),
            });
        }).catch(function(err) {
            console.error("err:", err);
        });
    }

    _getDataForUserIssueChart (allUsers, timeEntries) {
        var allIssues = this._getAllIssues(timeEntries);
        var result = [];
        var seriesOthers = {
            key: 'Other',
            values: [],
        };

        _.each(timeEntries, function(entrie, index) {
            seriesOthers.values.push({
                label: allUsers[index].name + ' (' + Math.round(entrie.totalHours) + 'h)',
                value: 0
            });
        });

        _.each(allIssues, function(issueID) {
            var isOthers = false;
            var issueValues = [];

            _.each(timeEntries, function(entrie, index) {
                var issueTime = entrie.hoursByIssue[issueID] ? entrie.hoursByIssue[issueID] : 0;
                if (issueTime !== 0 && issueTime < entrie.totalHours / 100) {
                    isOthers = true;
                }

                issueValues.push({
                    label: allUsers[index].name + ' (' + Math.round(entrie.totalHours) + 'h)',
                    value: issueTime
                });
            });

            if (isOthers) {
                for (var i = 0; i < issueValues.length; i++) {
                    seriesOthers.values[i].value += issueValues[i].value;
                }
            } else {
                result.push({
                    key: '#' + issueID,
                    values: issueValues,
                });
            }
        });

        result.unshift(seriesOthers);

        return result;
    }

    _getDataForUserActivityChart (allUsers, timeEntries) {
        var allActivities = this._getAllActivities(timeEntries);
        var result = [];

        _.each(allActivities, function(activityId) {
            var activityValues = [];

            _.each(timeEntries, function(entry, index) {
                var activityTime = entry.hoursByActivity[activityId] ? entry.hoursByActivity[activityId] : 0;

                activityValues.push({
                    label: allUsers[index].name + ' (' + Math.round(entry.totalHours) + 'h)',
                    value: activityTime
                });
            });

            result.push({
                key: activityId,
                values: activityValues,
            });
        });

        return result;
    }

    _getDataForUserProjectChart (allUsers, timeEntries, projects) {
        var allProjects = this._getAllProjects(timeEntries);
        var result = [];

        _.each(allProjects, function(projectId) {
            var projectValues = [];

            _.each(timeEntries, function(entry, index) {
                var projectTime = entry.hoursByProject[projectId] ? entry.hoursByProject[projectId] : 0;

                projectValues.push({
                    label: allUsers[index].name + ' (' + Math.round(entry.totalHours) + 'h)',
                    value: projectTime
                });
            });

            result.push({
                key: _.find(projects, {id: projectId}).name,
                values: projectValues,
            });
        });

        return result;
    }

    _getDataForTotalActivityChart (timeEntries) {
        var allActivities = this._getAllActivities(timeEntries);

        var result = [];

        _.each(allActivities, function(activityId) {
            var totalTimeSpendForActivity = 0;
            for (var i = 0; i < timeEntries.length; i++) {
                totalTimeSpendForActivity += timeEntries[i].hoursByActivity[activityId] ? timeEntries[i].hoursByActivity[activityId] : 0;
            }

            result.push({
                label: activityId,
                value: totalTimeSpendForActivity,
            });
        });

        return result;
    }

    _getDataForTotalProjectChart (timeEntries, projects) {
        var allProjects = this._getAllProjects(timeEntries);

        var result = [];

        _.each(allProjects, function(projectId) {
            var totalTimeSpendForProject = 0;

            for (var i = 0; i < timeEntries.length; i++) {
                totalTimeSpendForProject += timeEntries[i].hoursByProject[projectId] ? timeEntries[i].hoursByProject[projectId] : 0;
            }

            result.push({
                label: _.find(projects, {id: projectId}).name,
                value: totalTimeSpendForProject,
            });
        });

        return result;
    }

    _getAllIssues(timeEntries) {
        var allIssues = _.reduceRight(timeEntries, function(a, b) {
            return a.concat(b.links.issues);
        }, []);

        allIssues = _.uniq(allIssues);
        return _.sortBy(allIssues);
    }

    _getAllActivities(timeEntries) {
        var allActivities = _.reduceRight(timeEntries, function(a, b) {
            return a.concat(_.keys(b.hoursByActivity));
        }, []);

        allActivities = _.uniq(allActivities);
        return _.sortBy(allActivities);
    }

    _getAllProjects(timeEntries) {
        var allProjects = _.reduceRight(timeEntries, function(a, b) {
            return a.concat(_.keys(b.hoursByProject));
        }, []);

        allProjects = _.uniq(allProjects);
        return _.sortBy(allProjects);
    }
}

module.exports = Presenter;