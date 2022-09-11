import dayjs from 'dayjs';

import db from "../database/mongoDB.js";


const pegarRegistros = async (req, res) => {
    const session = res.locals.session;

    try {   
        const user = await db.collection("usuarios").findOne({_id: session.userId});

        const registros = await db.collection("registros").find({userId: user._id}).toArray();

        res.send(registros);
        
    } catch (error) {
        console.error(error);
        res.status(500).send("Não foi possível buscar os registros")
    }
}

const cadastrarEntrada = async (req, res) => {
    const {valor, descricao} = req.body;
    const session = res.locals.session;

    try {

        await db.collection("registros").insertOne({
            userId: session.userId,
            valor: valor,
            descricao: descricao,
            data: dayjs().format("DD/MM"),
            tipo: "entrada"
        })

        res.sendStatus(201);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao cadastrar uma entrada");
    }
};

const cadastrarSaida = async (req, res) => {
    const { valor, descricao } = req.body;
    const session = res.locals.session;

    try {

        await db.collection("registros").insertOne({
            userId: session.userId,
            valor: valor,
            descricao: descricao,
            data: dayjs().format("DD/MM"),
            tipo: "saida"
        })

        return res.sendStatus(201);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Erro ao registrar uma saída");
    }

}

export {pegarRegistros, cadastrarEntrada, cadastrarSaida};