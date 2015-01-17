'use strict';

var Backbone = require('backbone');

class Router {
    constructor(args) {
        if (!args.presenter) throw 'presenter required';
        var presenter = args.presenter;

        var BackboneRouter = Backbone.Router.extend({
            routes: {
                '': 'filter',
                ':params': 'filter',
            },

            filter: function(params) {
                presenter.filter(params);
            },
        });

        this.backboneRouter = new BackboneRouter();
    }

    start() {
        Backbone.history.start();
    }

    navigate(fragment, options) {
        options = options || {
            trigger: true
        };
        this.backboneRouter.navigate(fragment, options);
    }
}

module.exports = Router;