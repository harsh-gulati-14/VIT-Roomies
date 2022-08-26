var mongoose = require('mongoose');

var roomSchema = new mongoose.Schema({
    roomno: String,
    name: String,
    block: String,
    members: [mongoose.SchemaTypes.ObjectId],
    filled: Number,
    whatsapp: String
});

var Room = mongoose.model('Room', roomSchema);

module.exports = Room;