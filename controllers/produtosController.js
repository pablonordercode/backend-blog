const Produto = require("../models/produtosModels")
const ObjectId = require('mongoose').Types.ObjectId

exports.addProduto = async (req, res) => {
    const { titulo, descricao, fichatecnica, preco } = req.body

    if (!titulo || !descricao || !fichatecnica || !preco) {
        res.status(400).send({ msg: "Todos os campos devem ser preenchidos!" })
        return
    }
    // Verificação do arquivo de imagem
    if (!req.file || !req.file.filename) {
        return res.status(400).json({ msg: 'Imagem do produto é obrigatória' });
    }

    const criaProduto = new Produto({
        titulo,
        descricao,
        fichatecnica,
        preco,
        image: req.file.filename,
    })

    try {
        await criaProduto.save()
        res.status(200).json({ msg: "Postagem Criada!" })

    } catch (error) {
        console.error('Erro ao criar produto:', error);
        res.status(500).json({ msg: 'Erro no servidor', error: error.message });
    }
}

exports.buscarProduto = async (req, res) => {
    try {
        const pesqProduto = await Produto.find().sort({ createdAt: -1 })
        if (!pesqProduto || pesqProduto.length === 0) {
            return res.status(404).json({ msg: "produto nao encontrado!" })
        }
        res.status(200).json(pesqProduto)
    } catch (error) {
        console.error("Erro ao buscar postagens:", error.message);
        res.status(500).json({ msg: "Erro interno do servidor. Por favor, tente novamente mais tarde." });
    }
}

exports.buscaProdutoId = async (req, res) => {
    try {
        const id = req.params.id;

        // Validar ID
        if (!ObjectId.isValid(id)) {
            return res.status(422).json({ message: 'ID inválido!' });
        }

        // Buscar postagem por ID
        const produtoId = await Produto.findById(id);

        // Verificar se a postagem foi encontrada
        if (!produtoId) {
            return res.status(404).json({ message: 'Produto não encontrado.' });
        }

        // Retornar a postagem encontrada
        res.status(200).json(produtoId);
    } catch (error) {
        // Tratar erros inesperados
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

exports.editaProduto = async (req, res) => {
    try {
        const { id } = req.params;

        // Valida o ID
        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ msg: 'ID inválido' });
        }

        // Atualiza o produto
        const editProduto = await Produto.findByIdAndUpdate(id, req.body, {
            new: true, // Retorna o documento atualizado
            runValidators: true, // Garante que as validações do modelo sejam aplicadas
        });

        // Verifica se o produto foi encontrado
        if (!editProduto) {
            return res.status(404).json({ msg: 'Produto não encontrado' });
        }

        res.status(200).json(editProduto);
    } catch (error) {
        console.error(error); // Para depuração no servidor
        res.status(500).json({ msg: 'Erro no servidor', error: error.message });
    }
};


exports.deletProduto = async (req, res) => {
    try {
        const { id } = req.params

        // Validação do ID
        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ msg: 'ID inválido' });
        }

        // Deletar o produto
        const delProduto = await Produto.findByIdAndDelete(id);

        if (!delProduto) {
            return res.status(404).json({ msg: 'Produto não encontrado' });
        }
        res.status(200).json({ msg: 'Produto deletado com sucesso!', produto: delProduto });
    } catch (error) {
        console.error('Erro ao deletar produto:', error);
        res.status(500).json({ msg: 'Erro no servidor' });
    }
}