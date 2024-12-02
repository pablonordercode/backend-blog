const mongoose = require("mongoose");
const conectarDataBase = () => {
    
    console.log("database conectado...")
    mongoose.connect("")
    .then(() => console.log("mongoDB conectado")) 
    .catch((error)=> console.log(error))
}

module.exports = conectarDataBase