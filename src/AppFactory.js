'use strict';

var App = require('./App');
var Pubsub = require('pubsub-js');
var Repository = require('./Repository');
var Presenter = require('./Presenter');
var Router = require('./Router');
var UI = require('./ui/UI.jsx');
var React = require('react');

var ui = UI({
    pubsub: Pubsub
});

var repository = new Repository();

class AppFactory {
    create() {
        ui = React.renderComponent(ui, document.getElementById('content'));
        var presenter = new Presenter({
            repository: repository,
            ui: ui,
            pubsub: Pubsub
        });

        var router = new Router({
            presenter: presenter
        });

        presenter.router = router;
        return new App({
            pubsub: Pubsub,
            router: router,
            repository: repository,
            ui: ui,
            presenter: presenter
        });
    }
}

module.exports = AppFactory;