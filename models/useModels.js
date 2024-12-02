const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
    },
    celular: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: { 
        type: String,
      
    }
}, {timestamps: true})

const Usuario = mongoose.model("users", UserSchema);
module.exports = Usuario