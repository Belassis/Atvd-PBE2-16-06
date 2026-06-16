import { Router } from "express";
import produtoController from "../controllers/produtoController.js";
import upload from "../middlewares/upload.js";

const produtoRoutes = Router();

produtoRoutes.post('/', upload.single('imagem'), produtoController.criar);//Pega um arquivo enviado pelo formulario
produtoRoutes.put('/:id', produtoController.editar);
produtoRoutes.delete('/:id', produtoController.deletar);
produtoRoutes.get('/', produtoController.selecionar);
produtoRoutes.get('/:id', produtoController.selecionarPorId);

export default produtoRoutes;