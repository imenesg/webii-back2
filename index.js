const express = require("express");
const { pool } = require("./pool.js");
const jwt = require("jsonwebtoken");
const app = express();


app.use(express.json());

app.get('/', (req, res) => {
    res.send('home')
})


app.post('/login', async (req, res) => {
    try {
        pool.connect();
        const { email, senha } = req.body;
        const result = await pool.query(`SELECT * FROM usuarios WHERE email = '${email}' AND senha = '${senha}'`);
        if (result.rowCount === 0) {
            res.status(404).json({ message: "Usuário não encontrado" });
        } else {
            res.json({
                token: jwt.sign({
                    id: result.rows[0].id,
                    email: result.rows[0].email,
                    nome: result.rows[0].nome
                }, process.env.JWT_CHAVE),
                account: {
                    id: result.rows[0].id,
                    email: result.rows[0].email,
                    nome: result.rows[0].nome
                }
            })
        }
    } catch (err) {
        console.log('erro', err);
    }
})

app.get('/users', async(req,res) =>{
    pool.connect();
    const result = await pool.query(`SELECT * FROM usuarios`);
    res.send(result.rows)
})

app.post('/users', async(req,res) =>{
    try{
        pool.connect();
    const { email, senha, nome } = req.body;
    await pool.query(`INSERT INTO usuarios (nome , email, senha ) VALUES ('${nome}','${email}','${senha}')`);
    res.send('usuario cadastrado')
    }catch(err){
        console.log('erro', err)
    }
})

app.put('/users', async(req,res) =>{
    try{
        pool.connect();
    const { email, senha, nome } = req.body;
    const idUsuario = req.query.id;
    await pool.query(`UPDATE usuarios SET nome='${nome}', email='${email}',senha='${senha}' WHERE id=${idUsuario};`);
    res.send('usuario alterado')
    }catch(err){
        console.log('erro', err)
    }
})






app.listen(3000, () => {
    console.log("servidor rodando na porta 3000")
})