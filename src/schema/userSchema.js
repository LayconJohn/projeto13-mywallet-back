import joi from 'joi';

const userSchema = joi.object({
    nome: joi.string().min(1).required(),
    email: joi.string().email().required(),
    senha: joi.string().min(1).required()
});

const userLoginSchema = joi.object({
    email: joi.string().email().required(),
    senha: joi.string().min(1).required()
});

export {userSchema, userLoginSchema};