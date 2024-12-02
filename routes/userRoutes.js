const route = require("express").Router();
const { adduser,
    buscarTodosUsuarios,
    buscarUsuarioId,
    editarUser,
    deletarUsuario,
    loginUser
} = require("../controllers/userController");

route.post("/login", loginUser);
route.post("/adduser", adduser);
route.patch("/editarUsuario/:id", editarUser);
route.get("/todosUsuarios", buscarTodosUsuarios);
route.get("/usuarioPeloId/:id", buscarUsuarioId);
route.delete("/deletar/:id", deletarUsuario);




module.exports = route 