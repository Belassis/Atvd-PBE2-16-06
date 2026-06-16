import { connection } from "../configs/Database.js"

const categoriaRepository = {
    criar: async (categoria) => {
        const conn = await connection.getConnection();
        try {
            await conn.beginTransaction(); // Inicia a transação corretamente para escrita
            const sql = 'INSERT INTO categorias (nome, descricao) VALUES (?, ?)';
            const values = [categoria.nome, categoria.descricao];
            
            // CORREÇÃO: Utiliza a conexão 'conn' obtida do pool
            const [rows] = await conn.execute(sql, values);
            await conn.commit();
            return rows;
        } catch (error) {
            await conn.rollback(); // Desfaz alterações em caso de erro
            throw error;
        } finally {
            conn.release(); // Liberta a conexão de volta para a pool
        }
    },

    editar: async (categoria) => {
        const conn = await connection.getConnection();
        try {
            const sql = 'UPDATE categorias SET nome=?, descricao=? WHERE id_categoria = ?';
            const values = [categoria.nome, categoria.descricao, categoria.id];
            
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
            const sql = 'DELETE FROM categorias WHERE id_categoria = ?';
            const values = [id];
            
            const [rows] = await conn.execute(sql, values);
            return rows;
        } catch (error) {
            throw error;
        } finally {
            conn.release();
        }
    },

    selecionar: async () => {
        const conn = await connection.getConnection();
        try {
            const sql = 'SELECT * FROM categorias';
            
            const [rows] = await conn.execute(sql);
            return rows;
        } catch (error) {
            throw error;
        } finally {
            conn.release();
        }
    },

    selecionarUm: async (id) => {
        const conn = await connection.getConnection();
        try {
            const sql = 'SELECT * FROM categorias where id_categoria = ?';
            const values = [id];
            
            const [rows] = await conn.execute(sql, values);
            return rows;
        } catch (error) {
            throw error;
        } finally {
            conn.release();
        }
    }
};

export default categoriaRepository;