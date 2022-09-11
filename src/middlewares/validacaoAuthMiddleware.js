import { userSchema, userLoginSchema } from '../schema/userSchema.js';

function validarSchemaCadastro(req, res, next) {
    const {nome, email, senha} = req.body;

    const validation = userSchema.validate({nome, email, senha}, {abortEarly: false});

    if (validation.error) {
        const erros = validation.error.details.map((detail) => detail.message)
        return res.status(422).send(erros);
    } 

    res.locals.userCadastro = {nome, email, senha}

    next();
}

function validarSchemaLogin(req, res, next) {
    const {email, senha} = req.body;

    const validation = userLoginSchema.validate({email, senha}, {abortEarly: false});

    if (validation.error) {
        const erros = validation.error.details.map((detail) => detail.message)
        return res.status(422).send(erros);
    }

    res.locals.body = {email, senha}

    next();
}

export {validarSchemaCadastro, validarSchemaLogin}