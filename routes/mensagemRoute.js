const route = require("express").Router();

const { addMensagem, 
        buscarMensagem
      } = require("../controllers/mensagemController")

route.post("/criarmensagem", addMensagem);
route.get("/vermensagemrecebida", buscarMensagem);

module.exports = route 