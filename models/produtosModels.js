const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
    },
    descricao: {
        type: String,
        required: true
    },
    fichatecnica: { 
        type: String,
        required: true,
    },
    preco: { 
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    
}, {timestamps: true})

const Produto = mongoose.model("produtos", UserSchema);
module.exports = Produto