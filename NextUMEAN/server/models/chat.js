var models = require('./models'),
	Schema = models.Schema;

var chatSchema = new Schema({
	remitente : { type : Schema.Types.ObjectId, ref : 'Usuario' },
	destinatario : { type : Schema.Types.ObjectId, ref : 'Usuario' },
	tipo : String,
	mensajes : [{
			remitente : { type : Schema.Types.ObjectId, ref : 'Usuario' },
			destinatario : { type : Schema.Types.ObjectId, ref : 'Usuario' },
            contenido: String,
            fecha: { type: Date }
		}
	]
});

var Chat = models.model('Chat', chatSchema, 'chats');
module.exports = Chat;