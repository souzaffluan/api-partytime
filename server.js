//modules
const express = require('express');
const mongoose =  require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

//routes
const authRouter = require('./backend/routes/authRoutes');
const userRouter = require('./backend/routes/userRoutes');
const partyRouter = require('./backend/routes/partyRoutes');


//middlewares

//confing
const dbName = "partytime";
const port = 3000;

const app = express();

app.use(cors({
    origin: 'http://localhost:8080', // Permitir apenas requisições vindas do frontend
    optionsSuccessStatus: 200 // opcional
  }));
app.use(express.json());
app.use(express.static('public'));
//atrelar rotas no express
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/party", partyRouter);

//conexao mongo db

mongoose.connect(
    `mongodb://localhost/${dbName}`
);

app.get('/', (req, res)=>{
    res.json({message: "Rota teste!"})
});

app.listen(port, ()=>{
    console.log(`O backend está rodando na porta: ${port}`);
});