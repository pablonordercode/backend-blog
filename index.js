const express = require("express");
const userRoutes = require("./routes/userRoutes");
const produtoRoutes = require("./routes/produtoRoute");
const conectarDataBase = require("./db/conn");
const cors = require("cors");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 7001;

conectarDataBase()
app.use(express.json());
app.use('/uploads', express.static('uploads'))
app.use(cors());

app.use("/usuario", userRoutes);
app.use("/produtos", produtoRoutes);

app.listen(PORT, () => { 
    console.log(`rodando na port: ${PORT}`);
});

// mongodb+srv://pabloromuloxt660:<db_password>@cluster0.v21wi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0