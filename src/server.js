import 'dotenv/config';
import express from "express";
import routes from "./routes/routes.js";
import { initializeDatabase } from "./configs/Database.js";
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static('uploads'));
app.use('/', routes);

initializeDatabase().then(() => {
    app.listen(process.env.SERVER_PORT, () => {
        console.log(`Servidor rodando na porta ${process.env.SERVER_PORT}`);
    });
}).catch(err => {
    console.error("Erro ao inicializar o banco de dados:", err);
});