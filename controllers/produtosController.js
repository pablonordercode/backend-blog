const Produto = require("../models/produtosModels");
const ObjectId = require('mongoose').Types.ObjectId;
const fs = require('fs');
const path = require('path');

// Adicionar um novo produto
// exports.addProduto = async (req, res) => {
//     const { titulo, descricao, fichatecnica, preco, categoria } = req.body;

//     if (!titulo || !descricao || !fichatecnica || !preco) {
//         return res.status(400).send({ msg: "Todos os campos devem ser preenchidos!" });
//     }

//     // Verificação do arquivo de imagem
//     if (!req.file || !req.file.filename) {
//         return res.status(400).json({ msg: 'Imagem do produto é obrigatória' });
//     }

//     const categoriaFinal = categoria || "acessorios";

//     const criaProduto = new Produto({
//         titulo,
//         descricao,
//         fichatecnica,
//         preco,
//         image: req.file.filename,
//         categoria: categoriaFinal,
//     });

//     try {
//         await criaProduto.save();
//         res.status(200).json({ msg: "Postagem Criada!" });
//     } catch (error) {
//         console.error('Erro ao criar produto:', error);
//         res.status(500).json({ msg: 'Erro no servidor', error: error.message });
//     }
// };

exports.addProduto = async (req, res) => {
    const { titulo, descricao, fichatecnica, preco, categoria, quantidade } = req.body;

    if (!titulo || !descricao || !fichatecnica || !preco || quantidade === undefined) {
        return res.status(400).send({ msg: "Todos os campos devem ser preenchidos!" });
    }

    if (!req.file || !req.file.filename) {
        return res.status(400).json({ msg: 'Imagem do produto é obrigatória' });
    }

    const categoriaFinal = categoria || "acessorios";

    const criaProduto = new Produto({
        titulo,
        descricao,
        fichatecnica,
        preco,
        image: req.file.filename,
        categoria: categoriaFinal,
        quantidade, 
    });

    try {
        await criaProduto.save();
        res.status(200).json({ msg: "Produto Criado com Sucesso!" });
    } catch (error) {
        console.error('Erro ao criar produto:', error);
        res.status(500).json({ msg: 'Erro no servidor', error: error.message });
    }
};


// Buscar produto por título 
exports.searchController = async (req, res) => {
    const { titulo } = req.query;

    // Se não for fornecido um título, retorna todos os produtos
    if (!titulo) {
        return res.status(400).json({ msg: 'Parâmetro "titulo" é obrigatório para a busca.' });
    }

    try {
        // Buscar produtos que contenham o título (case insensitive)
        const foundPosts = await Produto.find({
            titulo: { $regex: titulo, $options: 'i' } // 'i' é para ignorar o caso (case insensitive)
        });

        if (foundPosts.length === 0) {
            return res.status(404).json({ msg: 'produto não encontrado .' });
        }

        return res.status(200).json(foundPosts);
    } catch (error) {
        console.error('Não encontrado:', error);
        res.status(500).send({ msg: 'Erro no servidor', error: error.message });
    }
};


// Buscar produtos, podendo filtrar por categoria
exports.buscarProduto = async (req, res) => {
    try {
        const categoria = req.query.categoria;
        const produtos = categoria
            ? await Produto.find({ categoria: categoria })
            : await Produto.find().sort({ createdAt: -1 });

        res.status(200).json(produtos);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar produtos", error });
    }
};


// Buscar produto por ID
exports.buscaProdutoId = async (req, res) => {
    try {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            return res.status(422).json({ message: 'ID inválido!' });
        }

        const produtoId = await Produto.findById(id);
        if (!produtoId) {
            return res.status(404).json({ message: 'Produto não encontrado.' });
        }

        res.status(200).json(produtoId);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};


exports.editaProduto = async (req, res) => {
    try {
        const { id } = req.params;


        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ msg: 'ID inválido' });
        }

        const produtoAtual = await Produto.findById(id);
        if (!produtoAtual) {
            return res.status(404).json({ msg: 'Produto não encontrado' });
        }

        const atualizacoes = req.body;

        if (req.file) {
            // Remover a imagem antiga, se existir
            if (produtoAtual.image) {
                const caminhoAntigo = path.join(__dirname, '..', '..', 'uploads', produtoAtual.image);
                if (fs.existsSync(caminhoAntigo)) {
                    fs.unlinkSync(caminhoAntigo);
                }
            }

            // Atualizar a referência da nova imagem
            atualizacoes.image = req.file.filename;
        }

        // Atualizar o produto no banco de dados
        const editProduto = await Produto.findByIdAndUpdate(
            id,
            { $set: atualizacoes },
            { new: true, runValidators: true }
        );

        // Responder com sucesso
        return res.status(200).json({ msg: 'Produto atualizado com sucesso', produto: editProduto });
    } catch (error) {
        console.error('Erro ao editar produto:', error);
        return res.status(500).json({ msg: 'Erro no servidor', error: error.message });
    }
};

exports.deletProduto = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ msg: 'ID inválido' });
        }

        const delProduto = await Produto.findByIdAndDelete(id);

        if (!delProduto) {
            return res.status(404).json({ msg: 'Produto não encontrado' });
        }

        res.status(200).json({ msg: 'Produto deletado com sucesso!', produto: delProduto });
    } catch (error) {
        console.error('Erro ao deletar produto:', error);
        res.status(500).json({ msg: 'Erro no servidor' });
    }
};
