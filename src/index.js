import express from 'express';
import cors from "cors";
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from "dotenv";
import joi from 'joi';
import chalk from 'chalk';
import dayjs from 'dayjs';
import bcrypt from 'bcrypt';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const mongoClient = new MongoClient("mongodb://localhost:27017");
let db;
mongoClient.connect().then(()=> {
    db = mongoClient.db("mywallet");
})

//Schemas

const userSchema = joi.object({
    nome: joi.string().min(1).required(),
    email: joi.string().email().required(),
    senha: joi.string().min(1).required()
})
 
//rotas login
app.post("/sign-up", async (req, res) => {
    const {nome, email, senha} = req.body;

    const senhaCriptografada = bcrypt.hashSync(senha, 10);

    const validation = userSchema.validate({nome, email, senha}, {abortEarly: false});

    if (validation.error) {
        const erros = validation.error.details.map((detail) => detail.message)
        return res.status(422).send(erros);
    }

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
        res.send(500);
    }
})
app.get("/users", async (req, res) => {
    try {
        const users = await db.collection("usuarios").find().toArray();
        res.send(users)
    } catch (error) {
        console.error(error);
        res.send(500)
    }
})


app.listen(process.env.PORT, () => {
    console.log(chalk.green("=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=."))
    console.log(chalk.green(`Servidor rodando na porta ${process.env.PORT}`))
    console.log(chalk.green("=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=."))
})