const Usuario = require("../models/useModels");
const bcrypt = require("bcrypt");


exports.adduser = async (req, res) => {
    const {nome, celular, email, password, avatar} = req.body

        if(!nome || !celular || !email || !password || !avatar) {
            res.status(400).send({ msg: `Todos os campos devem ser preenchidos!`})
        }

        const crypto = await bcrypt.genSalt(10)
        const senhaHash = await bcrypt.hash(password, crypto)

    const emailExiste = await Usuario.findOne({ email: email});
        if(emailExiste) {
            res.status(422).json("Usuario ja cadrastado!");
        }

    const criarUsuario = new Usuario({
        nome,
        celular,
        email,
        password: senhaHash,
        avatar, 
    });
        try {
            await criarUsuario.save();
            res.status(200).json({ msg: "Usuario criado com sucesso!!!"});
        } catch (error) {
            res.status(500).json({msg: error});
        }
}

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Validação dos campos
    if (!email) {
        return res.status(422).json({ msg: "O e-mail é obrigatório!" });
    }
    if (!password) {
        return res.status(422).json({ msg: "A senha é obrigatória!" });
    }

    try {
        // Verificar se o usuário existe
        const user = await Usuario.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ msg: "Usuário não encontrado" });
        }

        // Verificar a senha
        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            return res.status(422).json({ msg: "Senha inválida!" });
        }

        // Retornar os dados do usuário (exceto senha)
        const { _id, nome } = user;
        res.status(200).json({ msg: "Autenticação bem-sucedida!", user: { id: _id, nome, email } });
    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde." });
    }
};

exports.buscarTodosUsuarios = async (req, res) => {

    try {
        const pegaAllUsers = await Usuario.find()
        res.status(201).json(pegaAllUsers)
    } catch (error) {
        console.log(error)
    }
}

exports.buscarUsuarioId = async (req, res) => {
    const id = req.params.id
    try {
        const pegaIdUser = await Usuario.findById(id)
            if(!pegaIdUser) {
                res.status(402).json({msg: "Usuario não existe!"})
            }
        res.status(200).json(pegaIdUser)
    } catch (error) {
        console.log(error)
    }
}

exports.editarUser = async (req, res) => {
    try {
        const {id} = req.params
        const editUser = await Usuario.findByIdAndUpdate(id, req.body,{
            new: true
        })
        res.status(200).json(editUser)
    } catch (error) {
        console.log(error)
    }
}

exports.deletarUsuario = async (req, res) => {
    try {
        const {id} = req.params
        const removerUsuario = await Usuario.findByIdAndDelete({ _id: id});
        res.status(200).json(removerUsuario)
    } catch (error) {
        res.status(500).json({ msg: error});
    }
}
