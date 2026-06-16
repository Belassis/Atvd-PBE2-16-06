//Sem estes imports o sistema não saberia o que é uma Categoria; 
import { Categoria } from "../models/Categoria.js"; //Importa o model da categoria; 
import categoriaRepository from "../repositories/categoriaRepository.js";//Importa o repository; 

const categoriaController = {
    
    //Cadastrar uma categoria nova
    criar: async (req, res) => {
        try {
            const { nome, descricao } = req.body; //Pega o nome e a descrição enviados no body da requisição;
            const categoria = Categoria.criar({ nome, descricao });
            const result = await categoriaRepository.criar(categoria);
            res.status(200).json({ result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ MessageChannel: 'Ocorreu um erro no servidor', errorMessage: error.message });
            //MessageChannel é uma API do JavaScript usada para criar comunicação entre duas partes do código;
        }
    },
    //Altera categoria existente
    editar: async (req, res) => {
        try {
            const id = req.params.id;//Pega o id da URL(/categoria/3) e os dados novos do corpo, mandando o banco do repository atualizar; 
            const { nome, descricao } = req.body;
            const categoria = Categoria.alterar({ nome, descricao }, id);
            const result = await categoriaRepository.editar(categoria);
            res.status(200).json({ result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ MessageChannel: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    },
    //Remove uma categoria; 
    deletar: async (req, res) => {
        try {
            const id = req.params.id;//Precisa do id da URL e manda o repository deletar;
            const result = await categoriaRepository.deletar(id); //serve para pausar a execução do código até que o banco de dados termine de deletar a categoria
            res.status(200).json({ result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ MessageChannel: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    },
    //seleciona todas as categorias existentes
    selecionar: async (req, res) => {
        try {
            const result = await categoriaRepository.selecionar();
            res.status(200).json({ result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ MessageChannel: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    },
    //seleciona apenas uma categoria específica, fazemos essa consulta por ID
    selecionarUm: async (req, res) => {
        try {
            const id = req.params.id;
            const result = await categoriaRepository.selecionarUm(id);
            res.status(200).json({ result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ MessageChannel: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    }
}

export default categoriaController;