import { Router } from "express";

import {pegarRegistros, cadastrarEntrada, cadastrarSaida} from "../controllers/registrosControllers.js";
import { validarSchemaRegistro, validarUsuarioExistente } from "../middlewares/validacaoRegistrosMiddleware.js";

const router = Router();

router.get("/registros",validarUsuarioExistente ,pegarRegistros);
router.post("/entrada", validarSchemaRegistro, validarUsuarioExistente ,cadastrarEntrada);
router.post("/saida", validarSchemaRegistro, validarUsuarioExistente ,cadastrarSaida);

export default router;