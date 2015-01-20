'use strict';

var $ = require('jquery');
var AppFactory = require('./AppFactory');

$(document).ready(function() {
    var app = new AppFactory().create();
    app.run();

    window.app = app;
});