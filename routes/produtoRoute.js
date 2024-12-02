const route = require("express").Router();

const { addProduto, 
        buscarProduto, 
        buscaProdutoId, 
        editaProduto, 
        deletProduto
      } = require("../controllers/produtosController")

//middlewares
const { imageUpload } = require("../middlewares/imageUpload");

route.post("/postproduto", imageUpload.single("image"), addProduto);
route.get("/buscarAllProdutos", buscarProduto);
route.get("/buscarpeloId/:id", buscaProdutoId);
route.patch("/editeproduto/:id", editaProduto);
route.delete("/dellproduto/:id", deletProduto);

module.exports = route 