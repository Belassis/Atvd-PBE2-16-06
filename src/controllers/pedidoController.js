import { Pedido } from "../models/Pedido.js";
import { ItensPedido } from "../models/ItensPedido.js";
import pedidoRepository from "../repositories/pedidoRepository.js";
import { statusPed } from "../enums/statusPedido.js";

const pedidoController = {

    criar: async (req, res) => {

        //Cria um pedido
        try {
            let { itens, produtoId, quantidade } = req.body;
            const valorItem = await pedidoRepository.obterValorProduto(produtoId);
            const quantidade_itens = itens ? itens.length : 0; //se a variável itens existir ele acessa o lenght, senão ele ignora
            const subTotal = valorItem * quantidade; //o subtotal é o valor do item multiplicado pela quantidade, já que o pedido começa com apenas um item, o subtotal é igual ao valor do item. Se tiver mais itens, o subtotal será atualizado depois.
            const pedido = Pedido.criar({ subTotal, status: statusPed.ABERTO, quantidade_itens }); //Ele começa com esses valores iniciais assim que o pedido é criado
            const itensPedido = ItensPedido.criar({ produtoId, quantidade, subTotal, valorItem });

            const result = await pedidoRepository.criar(pedido, itensPedido);

            return res.status(201).json({
                result
            });

        } catch (error) {
            return res.status(500).json({message: "Erro ao criar pedido", error: error.message});
        }
    },

    //Seleciona todos os pedidos 
    selecionar: async (req, res) => {
        try {
            const status = req.params.status
            const id = req.params.id
            if (id) {
                const result = await pedidoRepository.selecionarPorId(id);
                return res.json(result);
            }
            if (status) {
                if (!Object.values(statusPed).includes(status)) {
                    return res.status(400).json({ message: "Status inválido" });
                }
                const result = await pedidoRepository.selecionar(status);
                return res.json(result);
            } else {
                const result = await pedidoRepository.selecionar();
                return res.json(result);
            }
        } catch (error) {
            return res.status(500).json({message: "Erro ao buscar pedidos", error: error.message});
        }
    },

    //Atualiza os status e a quantidade de itens apenas 
    // Atualiza o status do pedido apenas
    atualizar: async (req, res) => {
        try {
            const id = req.params.id;
            let { Status, status } = req.body; // Evita erro por falta de formatação

            if (!Status) {
                Status = status;
            }
            
            // Criamos o objeto do pedido apenas com o novo status e o ID correspondente
            const pedido = Pedido.editar({ subTotal: 0, status: Status, quantidade_itens: 0 }, id);

            // O repository roda o comando: UPDATE pedidos SET status = ? WHERE id_pedido = ?
            const result = await pedidoRepository.atualizar(pedido);

            return res.json(result);

        } catch (error) {
            console.error("Erro no controller do Back-end:", error);
            return res.status(500).json({message: "Erro ao atualizar pedido", error: error.message});
        }
    },
    //Deleta o pedido
    deletar: async (req, res) => {
        try {
            const id = req.params.id; //Procura o id para poder excluir
            const result = await pedidoRepository.deletar(id);
            return res.json({message: "Pedido deletado com sucesso", result});

        } catch (error) {
            return res.status(500).json({message: "Erro ao deletar pedido", error: error.message});
        }
    }
};

export default pedidoController;