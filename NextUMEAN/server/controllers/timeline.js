var Timeline = require('../models/timeline');
var Tareas = require('../models/tareas');
var Recursos = require('../models/recursos');

var ObjectId = require('mongoose').Types.ObjectId;
var _ = require('lodash');
var async = require('async');

exports.tareaFinalizada = function (req, res, next) {
	var items = function (tarea, callback) {
		var timeline = new Timeline({
			usuario : ObjectId(tarea.usuario.toString()),
			tarea : ObjectId(tarea._id.toString()),
			accion : 'finalizó una tarea',
			descripcion : tarea.descripcion,
			fecha: tarea.finalizada.fecha,
			tipo : 'tarea'
		});
		
		timeline.save(function (err, item) {
			if (!err) {
				console.log("Acción:Tarea guardada");
				return callback(null, item);
			}
		});
	};

	async.map(req.body.tareas, items, function (err, result) {
		async.waterfall([
			function (callback) {
				Timeline.populate(result, { path : 'usuario', model : 'Usuario' }, function (err, items) {
					callback(null, items);
				});
			},
			function (items, callback) {
				Timeline.populate(items, { path : 'tarea', model : 'Tarea' }, function (err, items) {
					callback(null, items);
				});
			}
		], function (err, data) {
			if (!err) {
				res.send({ populated : data, lean : req.body.tareas });
			} else {
				console.log(err);
			}
		});
	});
};

exports.recursoEnviado = function (req, res, next) {
    var timeline = new Timeline({
        usuario: req.body.recurso.remitente,
		recurso : req.body.recurso._id,
		accion : 'compartió un recurso',
		descripcion : req.body.recurso.asunto,
		tipo : 'recurso'
	});
	
	timeline.save(function (err, recurso) {
		if (!err) {
		    console.log("Acción:Recurso guardada");
		    Timeline.populate(recurso, { path : 'recurso', model : 'Recurso' }, function (err, recurso) {
		        req.body.recurso = recurso;
		        res.send(recurso);
		    });
		}
	});
};

exports.getTimeline = function (req, res, next) {
	var d = new Date();
	var anio = d.getFullYear();
	var mes = d.getMonth();
	var dia = d.getDate();
	console.log("Fecha: ", new Date(anio, mes, dia));
	
	Timeline.find({ fecha : { $gte : new Date(anio, mes, dia) } })
	.populate('usuario tarea recurso')
	.exec(function (err, docs) {
		if (!err) {
			Timeline.populate(docs, { path : 'recurso.remitente', model : 'Usuario' }, function (err, items) {
				res.send(items);
			});
		} else {
			console.log(err);
		}
	});
};