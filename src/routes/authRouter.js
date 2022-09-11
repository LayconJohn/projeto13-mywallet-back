import { Router } from "express";

import {cadastrarUser, logarUser} from "../controllers/authControllers.js";

import { validarSchemaCadastro, validarSchemaLogin } from '../middlewares/validacaoAuthMiddleware.js';

const router = Router();

router.post("/sign-up", validarSchemaCadastro, cadastrarUser);
router.post("/sign-in", validarSchemaLogin ,logarUser);

export default router;  