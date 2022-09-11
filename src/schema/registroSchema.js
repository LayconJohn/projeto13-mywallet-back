import joi from 'joi';

const registroSchema = joi.object({
    valor: joi.string().min(1).required(),
    descricao: joi.string().min(1).required()
})

export {registroSchema};