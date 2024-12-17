const express = require("express");
const userRoutes = require("./routes/userRoutes");
const produtoRoutes = require("./routes/produtoRoute");
const adminRoute = require("./routes/adminRoute");
const mensagemRoute = require("./routes/mensagemRoute")
const conectarDataBase = require("./db/conn");
const cors = require("cors");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 7001;

conectarDataBase()
app.use(express.json());
app.use('/uploads', express.static('uploads'))
app.use(cors());

app.use("/admin", adminRoute);
app.use("/usuario", userRoutes);
app.use("/produtos", produtoRoutes);
app.use("/msg", mensagemRoute);


app.listen(PORT, () => {
    console.log(`rodando na port: ${PORT}`);
});
