const API = "http://localhost:3000/servicos";

const btnCarregar = document.getElementById("carregar_servicos");
const listagem = document.getElementById("listagem");

btnCarregar.addEventListener("click", carregarServicos);

async function carregarServicos() {
    try {
        const resposta = await fetch(API);
        const dados = await resposta.json();

        listagem.innerHTML = ""; // limpa lista

        dados.forEach(s => criarServico(s));

    } catch (erro) {
        console.error("Erro ao carregar:", erro.message);
    }
}

function criarServico(s) {
    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td>${s.id_servico}</td>
        <td>${s.placa_veiculo_id}</td>
        <td>${s.nome}
        <td>${s.trabalho_feito}</td>
        <td>${s.data}</td>
        <td>${s.valor_servico}</td>
        <td>${s.situacao}</td>
    `;
    
    listagem.appendChild(tr);
}
