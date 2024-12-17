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
    mensagem: {
        type: String,
        required: true
    },

}, { timestamps: true })

const Mensagem = mongoose.model("mensagens", UserSchema);
module.exports = Mensagem