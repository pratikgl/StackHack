var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },

    name: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },

    mobile: {
        type: String,
        required: true,
        unique: true,
    },

    dob: {
        type: String,
        required: true,
    },

    aadhar_card: {
        type: String,
        unique: true,
    },
});

//model takes argument modelname and schema
module.exports = User = mongoose.model("user", userSchema);
