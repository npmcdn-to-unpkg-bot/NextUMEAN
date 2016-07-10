var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	TwitterStrategy = require('passport-twitter').Strategy;
var Usuario = require('../models/usuarios');

passport.serializeUser(function (user, done) {
	if (user) {
		done(null, user);
	}
});

passport.deserializeUser(function (user, done) {
	Usuario.findOne({ _id : user._id })
	.exec(function (err, user) {
		if (user) {
			return done(null, user);
		} else {
			return done(null, false);
		}
	});
});

passport.use('local', new LocalStrategy(
	function (username, password, done) {
		Usuario.findOne({ nombre_usuario : username })
		.exec(function (err, user) {
			if (user && user.authenticate(password)) {
				return done(null, user)
			} else {
				return done(null, false)
			}
		})
	}
));

passport.use(
	new TwitterStrategy(
		{
			consumerKey: 'nAg7UxXKOY3YVOc5ASoChbDah',
			consumerSecret: '54AvbvL7fZBqEEZVsC7dwbcJedHp5KvrabgxQuZ67aeN4KsysS',
			callbackURL: 'http://localhost:1337/auth/twitter/callback'
		},
		function (token, tokenSecret, profile, done) {
			Usuario.findOne({
				nombre_usuario : profile.username
			}).exec(function (err, usuario) {
				if (err) {
					console.log(err);
					return done(err);
				}
				if (!usuario) {
					var nuevoUsuario = new Usuario({
						nombre_usuario : profile.username,
						twitter : profile
					});
					
					var datos = JSON.stringify(eval("(" + profile._raw + ")"));
					nuevoUsuario.nombre = JSON.parse(datos).name;
					
					nuevoUsuario.save(function (err, user) {
						if (err) {
							done(err, null);
							return;
						}
						done(null, user);
					});
				} else {
					return done(err, usuario);
				}
			});
		}
	)
);

module.exports = passport;