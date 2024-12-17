const route = require("express").Router();

const { addProduto, 
        buscarProduto, 
        buscaProdutoId, 
        editaProduto, 
        deletProduto,
        searchController,
      } = require("../controllers/produtosController")

//middlewares
const { imageUpload } = require("../middlewares/imageUpload");

route.post("/postproduto", imageUpload.single("image"), addProduto);
route.get("/buscarAllProdutos", buscarProduto);
route.get("/searchProdutos", searchController);
route.get("/buscarpeloId/:id", buscaProdutoId);
route.patch("/editeproduto/:id", imageUpload.single("image"),editaProduto);
route.delete("/dellproduto/:id", deletProduto);

module.exports = route  