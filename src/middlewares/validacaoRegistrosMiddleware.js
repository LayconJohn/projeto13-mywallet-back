import { registroSchema } from "../schema/registroSchema.js";

import {mongo} from "../database/mongoDB.js";

let db = await mongo()

function validarSchemaRegistro(req, res, next) {
    const {valor, descricao} = req.body;

    const validation = registroSchema.validate({valor, descricao}, {abortEarly: false})
    if (validation.error) {
        const erros = validation.error.details.map(detail => detail.message);
        return res.status(422).send(erros);
    }
    next();
}

async function validarUsuarioExistente(req, res, next) {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
        return res.sendStatus(401);
    }

    try {
        const session = await db.collection("sessoes").findOne({token: token})
        if (!session) {
            return res.sendStatus(401);
        }

        res.locals.session = session;
        next()
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao validar usuário existente");
    }
}

export {validarSchemaRegistro, validarUsuarioExistente}
