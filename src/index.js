import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import chalk from 'chalk';

import authRouter from "./routes/authRouter.js";
import registrosRouter from "./routes/registrosRouter.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

//rotas login (auth)
app.use(authRouter);

//rotas registros
app.use(registrosRouter);

//Listen
app.listen(process.env.PORT, () => {
    console.log(chalk.green("=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=."))
    console.log(chalk.green(`Servidor rodando na porta ${process.env.PORT}`))
    console.log(chalk.green("=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=.=."))
})