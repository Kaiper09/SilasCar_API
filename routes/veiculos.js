const express = require("express");
const pool = require("../db")

const router = express.Router();

router.get("/", async (req, res) => {
    try {

        let {veiculo, cpf_dono } = req.query;
        veiculo = veiculo ? "%" + veiculo.trim() + "%" : "%";
        cpf_dono = cpf_dono ? "%" + cpf_dono.trim() + "%" : "%";

        const result = await pool.query(`
        SELECT v.cpf_dono, c.nome ,v.placa_veiculo, v.ano, v.nome_veiculo, v.km_veiculo
       FROM servicos.veiculos v

       JOIN servicos.clientes c
        ON v.cpf_dono = c.cpf

       WHERE 
       v.nome_veiculo ILIKE $1 
       AND v.cpf_dono ILIKE $2 
       AND c.situacao='Ativo'`, [veiculo, cpf_dono]);
        res.json(result.rows)
    } catch (err) {
        res.status(500).json({ error: "Erro ao listar veiculos!!", detalhes: err.message });
    }
})

router.get("/:placa_veiculo", async (req, res) => {
    try {
        const placa_veiculo = req.params.placa_veiculo;
        //console.log(placa_veiculo)
        const result = await pool.query(`
            SELECT cpf_dono, placa_veiculo, ano, nome_veiculo, km_veiculo
	FROM servicos.veiculos
	WHERE placa_veiculo=$1 ;`, [placa_veiculo]);
        res.json(result.rows)
    } catch (err) {
        res.status(500).json({ erro: "Erro ao buscar veiculo!", detalhes: err.message })
    }
})

router.put("/:placa_veiculo", async (req, res) => {
    try {
        const placa_veiculo = req.params.placa_veiculo;
        const { cpf_dono, ano, nome_veiculo, km_veiculo, } = req.body

        if (cpf_dono !== undefined) {
            return res.status(400).json({
                error: "Você não pode atualizar o CPF do dono do veículo!"
            });
        }

        const result = await pool.query(`
             UPDATE servicos.veiculos
      SET
        ano = COALESCE($1, ano),
        nome_veiculo = COALESCE($2, nome_veiculo),
        km_veiculo = COALESCE($3, km_veiculo)
      WHERE placa_veiculo = $4
      RETURNING *
            `,
            [ano, nome_veiculo, km_veiculo, placa_veiculo]);

        if (result.rows.length === 0) return res.status(404).json({ error: "Veiculo não encontrado" });
        res.json(result.rows[0]);

    } catch (err) {
        res.status(500).json({ error: "Erro ao atualizar veiculo!", detalhes: err.message })
    }
})

router.post("/", async (req, res) => {
    try {

        const { cpf_dono, placa_veiculo, ano, nome_veiculo, km_veiculo } = req.body;

        const cliente = await pool.query(
            `SELECT 1 FROM servicos.clientes WHERE cpf = $1`,
            [cpf_dono]
        );

        if (cliente.rowCount === 0) {
            return res.status(400).json({
                mensagem: "CPF do dono não encontrado. Cadastre um veiculo com o CPF de alguém já existente"
            });
        }

        const result = await pool.query(`
            INSERT INTO servicos.veiculos(
	            cpf_dono, placa_veiculo, ano, nome_veiculo, km_veiculo)
	        VALUES ($1, $2, $3, $4, $5)
            RETURNIG *;`,
            [cpf_dono, placa_veiculo, ano, nome_veiculo, km_veiculo]);

        res.status(201).json(result.rows[0]);

    } catch (err) {
        res.status(500).json({ error: "Erro ao inserir veiculo", detalhes: err.message })
    }
})



module.exports = router