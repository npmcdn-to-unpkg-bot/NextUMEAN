﻿var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var swig = require('swig');
var express = require('express');
var passport = require('./passport');
var session = require('express-session');
var redisStore = require('connect-redis')(session);

module.exports = function (app, config) {
    app.engine('html', swig.renderFile);
    app.set('view engine', 'html');
    app.set('views', config.rootPath + '/server/views');
    
    app.set('view cache', false);
	swig.setDefaults({ cache: false, varControls: ['{^', '^}'] });
	
	app.use(cookieParser());
	app.use(logger('dev'));
	
	//app.use(bodyParser());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
	app.use(bodyParser.json());
	app.use(session({
		store : new redisStore({
			disableTTL : true
		}),
		secret : 'nextuMEAN',
		key: 'sid',
		resave: true,
		saveUninitialized: true
	}));
	app.use(passport.initialize());
	app.use(passport.session());

    app.use(express.static(config.rootPath + '/public'));
};