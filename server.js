const express = require("express");
require("dotenv").config();
const cors = require('cors');

const app = express();
app.use(cors())
app.use(express.json());

const clientesRouter = require("./routes/clientes");
app.use("/clientes", clientesRouter);

const veiculosRouter = require("./routes/veiculos");
app.use("/veiculos", veiculosRouter);

const servicosRouter = require("./routes/servicos");
app.use("/servicos",servicosRouter);


const pagamentosRouter = require("./routes/pagamentos");
app.use("/pagamentos", pagamentosRouter);

app.get("/", (req, res) => {
  res.send("API de oficina rodando!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}/`));
