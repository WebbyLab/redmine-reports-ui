'use strict';

var redmineUrl = require('../etc/config.json').redmineUrl;

class App {
    constructor(args) {
        if (!args.ui) throw '"ui" required';
        if (!args.pubsub) throw '"pubsub" required';
        if (!args.router) throw '"router" required';
        if (!args.repository) throw '"repository" required';
        if (!args.presenter) throw '"presenter" required';

        this.ui = args.ui;
        this.pubsub = args.pubsub;
        this.router = args.router;
        this.repository = args.repository;
        this.presenter = args.presenter;
    }

    run() {
        this.initPubSubSubscriptions();
        this.initialRender();
        this.router.start();
    }

    initialRender() {
        this.presenter.updateHeaderData();
    }

    initPubSubSubscriptions() {
        var self = this;

        this.pubsub.subscribe('filter', function(msg, data) {
            self.presenter.updateUrl(data.users, data.projects, data.startDate, data.endDate);
        });

        this.pubsub.subscribe('selectIssue', function(msg, issueID) {
            window.open(redmineUrl + "/issues/" + issueID, '_blank');
        });

    }
}

module.exports = App;