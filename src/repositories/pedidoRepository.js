// repositories/pedidoRepository.js
import { connection } from "../configs/Database.js";

const pedidoRepository = {

    criar: async (pedido, itemPedido) => {
        const conn = await connection.getConnection();
        try {
            await conn.beginTransaction();

            const [pedidoResult] = await conn.execute(`INSERT INTO pedidos(subtotal, status, quantidade_itens) VALUES (?, ?, ?)`, [pedido.subTotal, pedido.status, itemPedido.quantidade]);

            const pedidoId = pedidoResult.insertId;
            const sqlItem = `INSERT INTO itens_pedido (pedidoId, produtoId, quantidade, valorItem) VALUES (?, ?, ?, ?)`;
            const values = [pedidoId, itemPedido.produtoId, itemPedido.quantidade, itemPedido.valorItem];

            const [rows] = await conn.execute(sqlItem, values);
            await conn.commit();
            return rows;
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    atualizar: async (pedido) => {
        const conn = await connection.getConnection();
        try {
            await conn.beginTransaction();

            const sql = `UPDATE pedidos SET status = ? WHERE id_pedido = ?`;
            const values = [pedido.status, pedido.id];
            const [rows] = await conn.execute(sql, values);

            if (pedido.status === 'Pendente') {
                // Busca todos os itens associados a este pedido
                const [itens] = await conn.execute(`SELECT produtoId, quantidade FROM itens_pedido WHERE pedidoId = ?`, [pedido.id]);

                for (const item of itens) {
                    // Verifica o estoque atual
                    const [produto] = await conn.execute(`SELECT quantidade_estoque, nome FROM produtos WHERE id_produto = ?`, [item.produtoId]);

                    if (produto.length > 0) {
                        const estoqueAtual = Number(produto[0].quantidade_estoque);
                        const qtdPedida = Number(item.quantidade);
                        const novoEstoque = estoqueAtual - qtdPedida;

                        if (novoEstoque < 0) throw new Error(`Estoque insuficiente para o produto: ${produto[0].nome}`);

                        // Atualiza o estoque na tabela de produtos
                        await conn.execute(`UPDATE produtos SET quantidade_estoque = ? WHERE id_produto = ?`, [novoEstoque, item.produtoId]);
                    }
                }
            }
            await conn.commit();
            return rows;
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    selecionar: async (status = null, id = null) => {
        const conn = await connection.getConnection();
        try {
            let sql = `
                SELECT 
                    p.id_pedido, p.subTotal, p.status, p.quantidade_itens, p.dataCad,
                    ip.idItem, ip.produtoId, ip.quantidade, ip.valorItem,
                    prod.nome AS nome_produto
                FROM pedidos p
                LEFT JOIN itens_pedido ip ON p.id_pedido = ip.pedidoId
                LEFT JOIN produtos prod ON ip.produtoId = prod.id_produto
            `;
            const values = [];

            if (id) {
                sql += ` WHERE p.id_pedido = ?`;
                values.push(id);
            } else if (status) {
                sql += ` WHERE p.status = ?`;
                values.push(status);
            }

            sql += ` ORDER BY p.dataCad DESC`;

            const [rows] = await conn.execute(sql, values);

            // Agrupa o resultado do MySQL num formato JSON estruturado
            const pedidosMap = {};
            rows.forEach(row => {
                if (!pedidosMap[row.id_pedido]) {
                    pedidosMap[row.id_pedido] = {
                        id_pedido: row.id_pedido,
                        subtotal: row.subTotal,
                        status: row.status,
                        quantidade_itens: row.quantidade_itens,
                        dataCad: row.dataCad,
                        itens: []
                    };
                }
                if (row.idItem) {
                    pedidosMap[row.id_pedido].itens.push({
                        idItem: row.idItem,
                        produtoId: row.produtoId,
                        quantidade: row.quantidade,
                        valorItem: row.valorItem,
                        nome_produto: row.nome_produto
                    });
                }
            });

            return Object.values(pedidosMap);
        } finally {
            conn.release();
        }
    },

    obterValorProduto: async (produtoId) => {
        const conn = await connection.getConnection();
        try {
            const sql = 'SELECT preco FROM produtos WHERE id_produto = ?';
            const values = [produtoId];
            const [rows] = await conn.execute(sql, values);
            return rows.length > 0 ? rows[0].preco : 0;
        } catch (error) {
            throw error;
        } finally {
            conn.release();
        }
    },

    selecionarUm: async (id) => {
        const conn = await connection.getConnection();
        try {
            const sql = 'SELECT * FROM pedidos WHERE id_pedido = ?';
            const values = [id];
            const [rows] = await conn.execute(sql, values);
            return rows;
        } catch (error) {
            throw error;
        } finally {
            conn.release();
        }
    },

    deletar: async (id) => {
        const conn = await connection.getConnection();
        try {
            await conn.beginTransaction();
            const sql = 'DELETE FROM pedidos WHERE id_pedido = ?';
            const values = [id];
            const [rows] = await conn.execute(sql, values);
            await conn.commit();
            return rows;
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    }
};

export default pedidoRepository;