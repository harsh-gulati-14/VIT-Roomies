var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');

var userSchema = new mongoose.Schema({
    isVerified: {
        type: Boolean,
        default: false,
        required: true
    },
    googleId: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    roomno: {
        type: String
    },
    block: {
        type: String
    },
    gender: {
        type: String
    },
    phoneNum: {
        type: Number
    },
    regNum: {
        type: String,
        unique: true
    },
    flag: {
        type: Boolean,
        required: true,
        default: false
    }
});


userSchema.plugin(findOrCreate);
var User = mongoose.model('User', userSchema);

module.exports = User;
