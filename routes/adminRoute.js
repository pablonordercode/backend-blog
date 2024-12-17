const route = require("express").Router();
const { criarAdmin,
        loginAdmin,
        buscarAllAdmin,
        deletarAdmin,
        buscarAdminId,
        editarAdmin,
        buscarAdminPorToken
      } = require("../controllers/adminControllers");
      
//middlewares
const { imageUpload } = require("../middlewares/imageUpload");
const authMiddleware = require('../middlewares/authMiddleware');

route.post("/adicionaradmim", criarAdmin); 
route.patch("/editaradm/:id", imageUpload.single('image'), editarAdmin); 
route.post("/loginadmin", loginAdmin);
route.get("/buscaradmin/:id", buscarAdminId);
route.get("/buscartodosadmin", buscarAllAdmin);
route.delete("/deletaradmin/:id", deletarAdmin); 
route.get("/admin/me",authMiddleware, buscarAdminPorToken);


module.exports = route   