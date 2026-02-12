const express= require("express");
const pool = require("../db")

const router = express.Router();

router.get("/",async (req, res)=>{
    try{

        let {servico, placa, situacao} = req.query;
        servico = servico ? "%" + servico.trim() + "%" :"%";
        placa = placa ? "%" + placa.trim() + "%" : "%";
        situacao = situacao ? "%" + situacao.trim() + "%" : "%";

        const result = await pool.query(`
           SELECT 
    s.id_servico,
    v.placa_veiculo,
    v.nome_veiculo,
    c.nome,
    s.trabalho_feito,
    to_char(s.data, 'DD/MM/YYYY') AS data_servico,
    s.placa_veiculo_id,
    s.valor_servico,
    s.situacao
FROM servicos.servicos s

JOIN servicos.veiculos v 
    ON s.placa_veiculo_id = v.placa_veiculo

JOIN servicos.clientes c
    ON v.cpf_dono = c.cpf

WHERE 
    s.trabalho_feito ILIKE $1 
    AND s.placa_veiculo_id ILIKE $2 
    AND s.situacao ILIKE $3 
    AND c.situacao = 'Ativo';
            `, [servico, placa,situacao]);
        res.json(result.rows)
    }catch(err){
        res.status(500).json({error: "Erro ao listar servicos!", detalhes: err.message})
    }
})

router.get("/:id_servico", async(req, res)=>{
    try{
        const id_servico = req.params.id_servico;

        const result = await pool.query(`
            SELECT id_servico, trabalho_feito, to_char(data, 'DD/MM/YYYY') as data_servico, placa_veiculo_id, valor_servico, situacao
	FROM servicos.servicos
	where id_servico = $1`, [id_servico]);
    
    res.json(result.rows)

    } catch (err) {
        res.status(500).json({ erro: "Erro ao buscar servico!", detalhes: err.message })
    }
});

router.put("/:id_servico", async (req, res) => {
    try {
        const { id_servico } = req.params;
        const { trabalho_feito, data, valor_servico, situacao } = req.body;

        const result = await pool.query(`
            UPDATE servicos.servicos
            SET
                trabalho_feito = COALESCE($1, trabalho_feito),
                data           = COALESCE($2, data),
                valor_servico  = COALESCE($3, valor_servico),
                situacao       = COALESCE($4, situacao)
            WHERE id_servico = $5
            RETURNING *;
        `, [trabalho_feito, data, valor_servico, situacao, id_servico]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Serviço não encontrado"});
        }

        res.json(result.rows[0]);

    } catch (err) {
        res.status(500).json({ error: "Erro ao atualizar serviço"});
    }
});

router.post("/", async (req, res) => {
    try {
        const {placa_veiculo_id, trabalho_feito, data, valor_servico,situacao } = req.body;

      
        const veiculo = await pool.query(
            `SELECT 1 FROM servicos.veiculos WHERE placa_veiculo = $1`,
            [placa_veiculo_id]
        );
        console.log(placa_veiculo_id)

        if (veiculo.rowCount === 0) {
            return res.status(400).json({
                mensagem: "Placa não encontrada. Cadastre o veículo antes de inserir o serviço."})
        }

        const result = await pool.query(`
            INSERT INTO servicos.servicos (placa_veiculo_id, trabalho_feito, data, valor_servico,situacao)
                VALUES ($1, $2, $3, $4, $5)
            RETURNING*;
        `, [placa_veiculo_id, trabalho_feito, data, valor_servico, situacao]);

        res.status(201).json(result.rows[0]);

    } catch (err) {
        res.status(500).json({error: "Erro ao inserir serviço", detalhes: err.message});
    }
});



module.exports = router;