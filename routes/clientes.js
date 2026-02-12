const express = require("express");
const pool = require("../db")

const router = express.Router();

router.get("/", async (req, res) => {
    try {

        let { nome, cidade } = req.query;
        nome = nome ? "%" + nome.trim() + "%" : "%";
        cidade = cidade ? "%" + cidade.trim() + "%" : "%";

        
        const result = await pool.query(`SELECT cpf, nome,to_char(nascimento, 'DD/MM/YYYY') as nascimento, numero, cidade, situacao FROM servicos.clientes
            WHERE nome ILIKE $1 AND cidade ILIKE $2`, [nome, cidade]);
        res.json(result.rows)
    } catch (err) {
        res.status(500).json({ error: "Erro ao listar clientes!", detalhes: err.message })
    }
})



router.get("/:cpf", async (req, res) => {
    try {
        const cpf = req.params.cpf
        //console.log(cpf)
        const result = await pool.query(`

            SELECT cpf, nome,to_char(nascimento, 'DD/MM/YYYY') as nascimento, numero, cidade, situacao 
            FROM servicos.clientes 
            WHERE cpf=$1`,
            [cpf]);

        res.json(result.rows)
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar clientes!", detalhes: err.message })
    }
})


router.put("/:cpf", async (req, res) => {
    try {
        const cpf = req.params.cpf;
        const { nome, nascimento, numero, cidade, situacao } = req.body;
        const result = await pool.query(`
            UPDATE servicos.clientes
      SET 
        nome = COALESCE($1, nome),
        nascimento = COALESCE($2, nascimento),
        numero = COALESCE($3, numero),
        cidade = COALESCE($4, cidade),
        situacao = COALESCE($5, situacao)
      WHERE cpf = $6
      RETURNING *
         `,
            // o coalesce funciona da seguinte maneira: ele só mantém o valor antigo se você não mandar nada.
            [nome, nascimento, numero, cidade, situacao, cpf]);

        if (result.rows.length === 0) return res.status(404).json({ error: "Cliente não encontrado" });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Erro ao atualizar cliente!", detalhes: err.message })
    }
});

router.post("/", async (req, res) => {
    try {
        const { cpf, nome, nascimento, numero, cidade, situacao } = req.body;
        const result = await pool.query(`
            INSERT INTO servicos.clientes(
	            cpf, nome, nascimento, numero, cidade, situacao)
	        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
            `,
            [cpf, nome, nascimento, numero, cidade, situacao]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Erro ao inserir cliente!", detalhes: err.message })
    }
})

router.delete("/:cpf", async (req, res) => {
    try {
        const cpf = req.params.cpf;
        const result = await pool.query(`
            DELETE FROM servicos.clientes 
            WHERE cpf=$1 RETURNING *;`, [cpf]);
            if (result.rows.length === 0) return res.status(404).json({ error: "Cliente não encontrado" });
    res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: "Erro ao deletar cliente" })
    }
});





module.exports = router;