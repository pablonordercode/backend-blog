const Admin = require("../models/adminModel");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// Chave secreta para o JWT
const JWT_SECRET = process.env.JWT_SECRET || " "; 

// Criar Admin
exports.criarAdmin = async (req, res) => {
    const { nome, email, password } = req.body;

    if (!nome || !email || !password) {
        return res.status(400).send({ msg: "Todos os campos devem ser preenchidos!" }); 
    }

    try {
        const emailExiste = await Admin.findOne({ email });
        if (emailExiste) {
            return res.status(422).json({ msg: "Admin já cadastrado!" });
        }

        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(password, salt);

        const criarAdmin = new Admin({
            nome,
            email,
            password: senhaHash,
        });

        await criarAdmin.save();
        res.status(201).json({ msg: "Admin criado com sucesso!!!" });
    } catch (error) {
        res.status(500).json({ msg: "Erro ao criar admin", error });
    }
};

// Login Admin
exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).json({ msg: "E-mail e senha são obrigatórios!" });
    }

    try {
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(404).json({ msg: "Admin não encontrado" });
        }

        const checkPassword = await bcrypt.compare(password, admin.password);
        if (!checkPassword) {
            return res.status(422).json({ msg: "Senha inválida!" });
        }

        // Gerar o token JWT
        const token = jwt.sign({ id: admin._id, email: admin.email }, JWT_SECRET, {
            expiresIn: "1h", 
        });

        res.status(200).json({
            msg: "Autenticação bem-sucedida!",
            token,
            admin: { id: admin._id, nome: admin.nome, email: admin.email },
        });
    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde." });
    }
};

// Buscar todos os Admins
exports.buscarAllAdmin = async (req, res) => {
    try {
        const pegaAllAdmin = await Admin.find().sort({ createdAt: -1 });
        res.status(200).json(pegaAllAdmin);
    } catch (error) {
        res.status(500).json({ msg: "Erro ao buscar admins", error });
    }
};

// Deletar Admin
exports.deletarAdmin = async (req, res) => {
    const { id } = req.params;

    try {
        const removerAdmin = await Admin.findByIdAndDelete(id);
        if (!removerAdmin) {
            return res.status(404).json({ msg: "Admin não encontrado" });
        }

        res.status(200).json({ msg: "Admin removido com sucesso", admin: removerAdmin });
    } catch (error) {
        res.status(500).json({ msg: "Erro ao deletar admin", error });
    }
};


exports.buscarAdminId = async (req, res) => {
    const id = req.params.id
    try {
        const pegaIdAdm = await Admin.findById(id)
        if (!pegaIdAdm) {
            res.status(402).json({ msg: "Usuario não existe!" })
        }
        res.status(200).json(pegaIdAdm)
    } catch (error) {
        console.log(error)
    }
}

// Editar Admin
exports.editarAdmin = async (req, res) => {
    const { id } = req.params; // ID do admin a ser editado
    const { nome, email, password } = req.body;

    try {
        // Verifica se o admin existe
        const admin = await Admin.findById(id);
        if (!admin) {
            return res.status(404).json({ msg: "Admin não encontrado!" });
        }

        // Atualizar campos se fornecidos
        if (nome) admin.nome = nome;

        if (email) {
            const emailExiste = await Admin.findOne({ email });
            if (emailExiste && emailExiste.id !== id) {
                return res.status(422).json({ msg: "Email já está em uso por outro admin!" });
            }
            admin.email = email;
        }

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const senhaHash = await bcrypt.hash(password, salt);
            admin.password = senhaHash;
        }

        await admin.save(); // Salva as alterações no banco
        res.status(200).json({ msg: "Admin atualizado com sucesso!", admin });
    } catch (error) {
        res.status(500).json({ msg: "Erro ao atualizar admin", error });
    }
};

exports.buscarAdminPorToken = async (req, res) => {
    try { 
        // Verificar o cabeçalho de autorização
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ msg: 'Token não fornecido.' });
        }

        // Decodificar o token para obter o ID do admin
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Buscar o admin no banco de dados
        const admin = await Admin.findById(decoded.id); 
        if (!admin) {
            return res.status(404).json({ msg: 'Admin não encontrado.' });
        }

        // Retornar os dados do admin
        res.status(200).json({
            nome: admin.nome,
            email: admin.email,
            image: admin.image,
        });
    } catch (error) {
        console.error('Erro ao buscar admin pelo token:', error);
        res.status(500).json({ msg: 'Erro no servidor.', error: error.message });
    }
};
