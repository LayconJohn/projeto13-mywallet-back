import { userSchema } from '../schema/userSchema.js';

function validarSchemaCadastro(res, res, next) {
    const {nome, email, senha} = req.body;

    const validation = userSchema.validate({nome, email, senha}, {abortEarly: false});

    if (validation.error) {
        const erros = validation.error.details.map((detail) => detail.message)
        return res.status(422).send(erros);
    }

    next();
}

function validarSchemaLogin(res, res, next) {
    const {email, senha} = req.body;

    const validation = userSchema.validate({email, senha}, {abortEarly: false});

    if (validation.error) {
        const erros = validation.error.details.map((detail) => detail.message)
        return res.status(422).send(erros);
    }

    next();
}

export {validarSchemaCadastro, validarSchemaLogin}