const express = require("express");
const pool = require("../db")

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        let { metodo, situacao } = req.query;
        metodo = metodo ? "%" + metodo.trim() + "%" : "%";
        situacao = situacao ? "%" + situacao.trim() + "%" : "%";

        const result = await pool.query(`SELECT 
    p.id_pagamento,
    p.id_servico,
    to_char(p.data, 'DD/MM/YYYY') AS data,
    p.metodo,
    p.situacao,
    to_char(p.data_vencimento, 'DD/MM/YYYY') AS data_vencimento,
    p.valor,
    v.placa_veiculo,
    c.nome
FROM servicos.pagamentos p

JOIN servicos.servicos s 
    ON p.id_servico = s.id_servico

JOIN servicos.veiculos v 
    ON s.placa_veiculo_id = v.placa_veiculo

JOIN servicos.clientes c 
    ON v.cpf_dono = c.cpf

WHERE 
    c.situacao ILIKE $1
    AND p.metodo ILIKE $2
    AND c.situacao = 'Ativo'`, [situacao, metodo]);
        res.json(result.rows)
    } catch (err) {
        res.status(500).json({ error: "Erro ao listar pagamentos!!", detalhes: err.message });
    }
})


/*const result = await pool.query(`SELECT id_pagamento ,id_servico, to_char (data, 'DD/MM/YYYY') as data, metodo, situacao, to_char (data_vencimento, 'DD/MM/YYYY') as data_vencimento, valor
           FROM servicos.pagamentos
           WHERE situacao ILIKE $1 AND metodo ILIKE $2`, [situacao, metodo]);*/

router.get("/:id_pagamento", async (req, res) => {
    try {
        const id_pagamento = req.params.id_pagamento;

        const result = await pool.query(`
            SELECT * FROM servicos.pagamentos
                WHERE id_pagamento=$1
            `, [id_pagamento]);

        res.json(result.rows)

    } catch (err) {
        res.status(500).json({ erro: "Erro ao buscar servico!", detalhes: err.message })
    }
})

router.put("/:id_pagamento", async (req, res) => {
    try {
        const { id_pagamento } = req.params;
        const { data, metodo, situacao, data_vencimento, valor } = req.body;

        const result = await pool.query(`
            UPDATE servicos.pagamentos
            SET
                data            = COALESCE($1, data),
                metodo          = COALESCE($2, metodo),
                situacao        = COALESCE($3, situacao),
                data_vencimento = COALESCE($4, data_vencimento,
                valor           = COALESCE($5, valor)
            WHERE id_pagamento = $6
            RETURNING *;`, [data, metodo, situacao, data_vencimento, valor, id_pagamento]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Pagamento não encontrado" });
        }

        res.json(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao atualizar pagamento" });
    }
});


router.post("/", async (req, res) => {
    try {
        const { data, metodo, situacao, data_vencimento, id_servico, valor } = req.body;

        const servicoExiste = await pool.query(`
            SELECT 1 FROM servicos.servicos 
             WHERE id_servico = $1
        `, [id_servico]);

        if (servicoExiste.rowCount === 0) {
            return res.status(400).json({
                error: "Serviço informado não existe"
            });
        }

        const result = await pool.query(`
            INSERT INTO servicos.pagamentos (data,metodo, situacao,data_vencimento,id_servico)
                VALUES (to_date($1, 'DD/MM/YYYY'),$2, $3, to_date($4, 'DD/MM/YYYY'), $5, $6)
            RETURNING *;
        `, [data, metodo, situacao, data_vencimento, id_servico, valor]);

        res.status(201).json(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao inserir pagamento"
        });
    }
});


module.exports = router