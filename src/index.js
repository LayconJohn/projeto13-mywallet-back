import express, { response } from 'express';
import cors from "cors";
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from "dotenv";
import joi from 'joi';
import chalk from 'chalk';
import dayjs from 'dayjs';
import bcrypt from 'bcrypt';
import { v4 as uuid } from "uuid";

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

const registroSchema = joi.object({
    valor: joi.string().min(1).required(),
    descricao: joi.string().min(1).required()
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

app.post("/sign-in", async (req, res) => {
    const {email, senha} = req.body;

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

app.get("/registros", async (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
        return res.sendStatus(401);
    }

    try {   
        const session = await db.collection("sessoes").findOne({token: token});
        if (!session) {
            return res.sendStatus(401);
        }

        const user = await db.collection("usuarios").findOne({_id: session.userId});

        const registros = await db.collection("registros").find({userId: session.userId}).toArray();

        res.send(registros);
        
    } catch (error) {
        console.error(error);
        res.status(500).send("Não foi possível buscar os registros")
    }
})

app.post("/entrada", async (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const {valor, descricao} = req.body;

    if (!token) {
        return res.send(401);
    }

    const validation = registroSchema.validate({valor, descricao}, {abortEarly: false})
    if (validation.error) {
        const erros = validation.error.details.map(detail => detail.message);
        return res.status(422).send(erros);
    }

    try {
        const session = await db.collection("sessoes").findOne({token: token})
        if (!session) {
            return res.send(401);
        }

        await db.collection("registros").insertOne({
            userId: session.userId,
            valor: valor,
            descricao: descricao,
            data: dayjs().format("DD/MM"),
            type: "entrada"
        })

        res.sendStatus(201);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao cadastrar uma entrada");
    }

})


app.listen(process.env.PORT, () => {
    console.log(chalk.green("=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=."))
    console.log(chalk.green(`Servidor rodando na porta ${process.env.PORT}`))
    console.log(chalk.green("=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=."))
})