import bcrypt from 'bcrypt';
import { v4 as uuid } from "uuid";

import {mongo} from "../database/mongoDB.js";

let db = await mongo()

const cadastrarUser = async (req, res) => {
    const {nome, email, senha} = res.locals.userCadastro;

    const senhaCriptografada = bcrypt.hashSync(senha, 10);

    try {
        const user = await db.collection("usuarios").findOne({email: email});
        if (user) {
            return res.status(409).send("Usuário já cadastrado")
        }

        await db.collection("usuarios").insertOne({
            nome: nome,
            email: email,
            senha: senhaCriptografada
        })

        res.sendStatus(201);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

const logarUser = async (req, res) => {
    const {email, senha} = res.locals.body;

    try {
        const user = await db.collection("usuarios").findOne({email: email});
        if (user && bcrypt.compareSync(senha, user.senha)) {
            const token = uuid();

            await db.collection("sessoes").insertOne({
                userId: user._id,
                token: token
            })

            res.status(200).send({
                nome: user.nome,
                token: token
            })

        } else {
            return res.status(400).send("Usuário ou senha inválido")
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

export {cadastrarUser, logarUser};