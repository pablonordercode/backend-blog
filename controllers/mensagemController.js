const Mensagem = require("../models/mensagemUser");

exports.addMensagem = async (req, res) => {
    const { nome, celular, email, mensagem } = req.body;

    if (!nome || !celular || !email || !mensagem) {
        return res.status(400).send({ msg: "Todos os campos devem ser preenchidos!" });
    }

    const criaMensagem = new Mensagem({
        nome,
        celular,
        email,
        mensagem,

    });

    try {
        await criaMensagem.save();
        res.status(200).json({ msg: "Mensagem enviada!" });
    } catch (error) {
        console.error('Erro ao criar mensagem:', error);
        res.status(500).json({ msg: 'Erro no servidor', error: error.message });
    }
};

exports.buscarMensagem = async (req, res) => {
    try {
        const buscarPosts = await Mensagem.find().sort({ createdAt: -1 });

        if (!buscarPosts || buscarPosts.length === 0) {
            return res.status(404).json({ msg: "Nenhuma postagem encontrada." });
        }

        res.status(200).json(buscarPosts);
    } catch (error) {
        console.error("Erro ao buscar postagens:", error.message);
        res.status(500).json({ msg: "Erro interno do servidor. Por favor, tente novamente mais tarde." });
    }
};