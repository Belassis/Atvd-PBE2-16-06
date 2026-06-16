import { ItensPedido } from "../models/ItensPedido.js"
import itensPedidoRepository from "../repositories/itensPedidoRepository.js";

const itensPedidoController = {

    buscarItem: async (req, res) => {
        try {
            const id = req.params.id;
            const result = await itensPedidoRepository.buscarItem(id);
            if (!result) {
                return res.status(404).json({ message: "Item do pedido não encontrado" });
            }
            return res.json(result);
        } catch (error) {
            return res.status(500).json({
                message: "Erro ao buscar item do pedido",
                error: error.message
            });
        }
    },

    criar: async (req, res) => {
        try {
            let { pedidoId, produtoId, quantidade } = req.body;

            // Validação simples de entrada no Controller
            if (!pedidoId || !produtoId || !quantidade || quantidade <= 0) {
                return res.status(400).json({ message: "Dados de entrada inválidos ou quantidade zerada." });
            }

            // LIMPEZA: Removeu-se a busca redundante de preço e o cálculo matemático daqui.
            // Passamos apenas as informações cruciais recebidas.
            const result = await itensPedidoRepository.criar({ pedidoId, produtoId, quantidade });

            return res.status(201).json({ result });

        } catch (error) {
            return res.status(500).json({
                message: "Erro ao criar item do pedido",
                error: error.message
            });
        }
    },

    atualizar: async (req, res) => {
        try {
            const id = req.params.id;
            const { quantidade } = req.body;

            const result = await itensPedidoRepository.atualizar(id, quantidade);
            if (quantidade === 0) {
                await itensPedidoRepository.deletar(id);
            }
            return res.json(result);
        } catch (error) {
            return res.status(500).json({
                message: "Erro ao atualizar item",
                error: error.message
            });
        }
    },

    deletar: async (req, res) => {
        try {
            const id = req.params.id;
            const result = await itensPedidoRepository.deletar(id);

            return res.json({
                message: "Item deletado com sucesso",
                result
            });

        } catch (error) {
            return res.status(500).json({
                message: "Erro ao deletar item",
                error: error.message
            });
        }
    }
};

export default itensPedidoController;