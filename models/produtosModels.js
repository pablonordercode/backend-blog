// const mongoose = require("mongoose");

// const UserSchema = new mongoose.Schema({
//     titulo: {
//         type: String,
//         required: true,
//     },
//     descricao: {
//         type: String,
//         required: true,
//     },
//     fichatecnica: {
//         type: String,
//         required: true,
//     },
//     preco: {
//         type: Number,
//         required: true,
//     },
//     image: {
//         type: String,
//         required: true,
//     },
//     categoria: {
//         type: String,
//         enum: ['celulares', 'acessorios'], 
//         required: true, 
//     }
// }, { timestamps: true });

// const Produto = mongoose.model("produtos", UserSchema);
// module.exports = Produto;


const mongoose = require("mongoose");

const ProdutoSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
    },
    descricao: {
        type: String,
        required: true,
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
    categoria: {
        type: String,
        enum: ['celulares', 'acessorios'],
        required: true,
    },
    quantidade: { // Novo campo de quantidade
        type: Number,
        required: true,
        min: 0, // Restrição para valores não negativos
    },
}, { timestamps: true });

const Produto = mongoose.model("produtos", ProdutoSchema);
module.exports = Produto;
