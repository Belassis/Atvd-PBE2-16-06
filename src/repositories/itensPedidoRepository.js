import { connection } from "../configs/Database.js";

const itensPedidoRepository = {

    buscarItem: async (id) => {
        const conn = await connection.getConnection();
        try {
            const sql = `SELECT * FROM itens_pedido WHERE idItem = ?`;
            const values = [id];
            const [rows] = await conn.execute(sql, values);
            return rows[0];
        } catch (error) {
            throw error;
        } finally {
            conn.release();
        }
    },

    criar: async (itemPedido) => {
        const conn = await connection.getConnection();

        try {
            await conn.beginTransaction();

            const [itemExistente] = await conn.execute(`SELECT idItem, quantidade, valorItem FROM itens_pedido WHERE pedidoId = ? AND produtoId = ?`, [itemPedido.pedidoId, itemPedido.produtoId]);

            const [produto] = await conn.execute(`SELECT preco FROM produtos WHERE id_produto = ?`, [itemPedido.produtoId]);

            if (produto.length === 0) throw new Error("Produto não encontrado");

            const precoUnitario = Number(produto[0].preco);
            let result;

            if (itemExistente.length > 0) {
                // Se o produto já existe no carrinho, aumenta a quantidade e atualiza o subtotal do item
                const novaQuantidade = Number(itemExistente[0].quantidade) + Number(itemPedido.quantidade);
                const novoValorItem = (precoUnitario * novaQuantidade).toFixed(2);

                const sqlUpdate = `UPDATE itens_pedido SET quantidade = ?, valorItem = ? WHERE idItem = ?`;
                const valuesUpdate = [novaQuantidade, novoValorItem, itemExistente[0].idItem];

                [result] = await conn.execute(sqlUpdate, valuesUpdate);
            } else {
                // Se é um produto novo no carrinho, calcula o valor total inicial deste item
                const valorItemTotal = (precoUnitario * Number(itemPedido.quantidade)).toFixed(2);

                const sqlInsert = `INSERT INTO itens_pedido (pedidoId, produtoId, quantidade, valorItem) VALUES (?, ?, ?, ?)`;
                const valuesInsert = [itemPedido.pedidoId, itemPedido.produtoId, itemPedido.quantidade, valorItemTotal];

                [result] = await conn.execute(sqlInsert, valuesInsert);
            }

            // Recalcula dinamicamente o valor total acumulado do pedido inteiro
            await recalcularSubtotal(conn, itemPedido.pedidoId);

            await conn.commit();
            return result;

        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    atualizar: async (id, quantidade) => {
        const conn = await connection.getConnection();
        try {
            await conn.beginTransaction();

            // Busca os dados do item para saber qual é o pedido e o produto
            const [item] = await conn.execute(`SELECT pedidoId, produtoId FROM itens_pedido WHERE idItem = ?`, [id]);
            if (item.length === 0) throw new Error("Item não encontrado");

            const pedidoId = item[0].pedidoId;
            const produtoId = item[0].produtoId;

            // Busca o preço do produto para atualizar o valorItem proporcionalmente
            const [produto] = await conn.execute(`SELECT preco FROM produtos WHERE id_produto = ?`, [produtoId]);
            const precoUnitario = Number(produto[0].preco);
            const novoValorItem = (precoUnitario * quantidade).toFixed(2);

            const sql = `UPDATE itens_pedido SET quantidade = ?, valorItem = ? WHERE idItem = ?`;
            const values = [quantidade, novoValorItem, id];
            const [rows] = await conn.execute(sql, values);

            await recalcularSubtotal(conn, pedidoId);

            await conn.commit();
            return rows;
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    deletar: async (id) => {
        const conn = await connection.getConnection();
        try {
            await conn.beginTransaction();

            const [item] = await conn.execute(`SELECT pedidoId FROM itens_pedido WHERE idItem = ?`, [id]);
            if (item.length === 0) throw new Error("Item não encontrado");
            const pedidoId = item[0].pedidoId;

            await conn.execute(`DELETE FROM itens_pedido WHERE idItem = ?`, [id]);

            await recalcularSubtotal(conn, pedidoId);

            await conn.commit();
            return { id };

        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    }
};

// Função auxiliar para manter a consistência financeira dos pedidos
const recalcularSubtotal = async (conn, pedidoId) => {
    const [resultado] = await conn.execute(
        `SELECT 
            SUM(valorItem) AS subtotal,
            SUM(quantidade) AS quantidade_itens
         FROM itens_pedido 
         WHERE pedidoId = ?`,
        [pedidoId]
    );

    const novoSubtotal = Number(resultado[0].subtotal || 0);
    const novaQuantidadeItens = Number(resultado[0].quantidade_itens || 0);

    if (novaQuantidadeItens === 0) {
        // Se o pedido ficou sem nenhum item, remove o pedido por completo
        await conn.execute(`DELETE FROM pedidos WHERE id_pedido = ?`, [pedidoId]);
        return { deleted: true, pedidoId };
    }

    // Caso contrário, atualiza a tabela pedidos com a nova soma matemática dos itens
    await conn.execute(`UPDATE pedidos SET subtotal = ?, quantidade_itens = ? WHERE id_pedido = ?`, [novoSubtotal, novaQuantidadeItens, pedidoId]);
};

export default itensPedidoRepository;