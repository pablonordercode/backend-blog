const Admin = require("../models/adminModel");
const bcrypt = require("bcrypt");


exports.criarAdmin = async (req, res) => {
    const { nome, email, password } = req.body

    if (!nome || !email || !password) {
        res.status(400).send({ msg: `Todos os campos devem ser preenchidos!` })
    }

    const crypto = await bcrypt.genSalt(10)
    const senhaHash = await bcrypt.hash(password, crypto)

    const emailExiste = await Admin.findOne({ email: email });
    if (emailExiste) {
        res.status(422).json("Admin ja cadrastado!");
    }

    const criarAdmin = new Admin({
        nome,
        email,
        password: senhaHash,
    });
    try {
        await criarAdmin.save();
        res.status(200).json({ msg: "Admin criado com sucesso!!!" });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}

exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(422).json({ msg: "O e-mail é obrigatório!" });
    }
    if (!password) {
        return res.status(422).json({ msg: "A senha é obrigatória!" });
    }

    try {
        // Verificar se o usuário existe
        const admin = await Admin.findOne({ email: email });

        if (!admin) {
            return res.status(404).json({ msg: "Admin não encontrado" });
        }

        const checkPassword = await bcrypt.compare(password, admin.password);
        if (!checkPassword) {
            return res.status(422).json({ msg: "Senha inválida!" });
        }

        // Retornar os dados do usuário exceto senha
        const { _id, nome } = admin;
        res.status(200).json({ msg: "Autenticação bem-sucedida!", admin: { id: _id, nome, email } });
    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde." });
    }
};

exports.buscarAllAdmin = async (req, res) => {

    try {
        const pegaAllAdmin = await Admin.find().sort({ createdAt: -1 });
        res.status(201).json(pegaAllAdmin);
    } catch (error) {
        console.log(error);
    }
}

exports.deletarAdmin = async (req, res) => {
    try {
        const { id } = req.params
        const removerAdmin = await Admin.findByIdAndDelete({ _id: id });
        res.status(200).json(removerAdmin)
    } catch (error) {
        res.status(500).json({ msg: error });
    }
}




