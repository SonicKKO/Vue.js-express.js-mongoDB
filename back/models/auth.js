const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    email: String,
    name: String,
    password: {type: String, required: true}
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;