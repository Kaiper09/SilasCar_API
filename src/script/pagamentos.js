const API = "http://localhost:3000/pagamentos";

const btnCarregar = document.getElementById("carregar_pagamentos");
const listagem = document.getElementById("listagem");

btnCarregar.addEventListener("click", carregarPagamentos);

async function carregarPagamentos() {
    try {
        const resposta = await fetch(API);
        const dados = await resposta.json();

        listagem.innerHTML = ""; // limpa lista

        dados.forEach(p => criarPagamento(p));

    } catch (erro) {
        console.error("Erro ao carregar:", erro.message);
    }
}

function criarPagamento(p) {
    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td>${p.id_pagamento}</td>
        <td>${p.placa_veiculo}</td>
        <td>${p.nome}
        <td>${p.data}</td>
        <td>${p.metodo}</td>
        <td>${p.data_vencimento}</td>
        <td>${p.situacao}</td>
        <td>${p.valor}</td>
    `;

    listagem.appendChild(tr);
}



