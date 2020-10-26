var mongoose = require('mongoose')
var UserSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true,
        index: true,
        required: true
    },
    password: String,
    role: String
});
mongoose.model('User', UserSchema);
module.exports = mongoose.model('User');
