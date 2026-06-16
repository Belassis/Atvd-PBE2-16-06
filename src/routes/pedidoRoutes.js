import { Router } from "express";
import pedidoController from "../controllers/pedidoController.js";
const pedidoRoutes = Router();

pedidoRoutes.post('/', pedidoController.criar);
pedidoRoutes.get('/', pedidoController.selecionar);
pedidoRoutes.get('/:status', pedidoController.selecionar);
pedidoRoutes.get('/id/:id', pedidoController.selecionar);

pedidoRoutes.put('/:id', pedidoController.atualizar);
pedidoRoutes.delete('/:id', pedidoController.deletar);

export default pedidoRoutes;