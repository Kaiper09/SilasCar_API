const API = "http://localhost:3000/veiculos";

const btnCarregar = document.getElementById("carregar_veiculos");
const listagem = document.getElementById("listagem");

btnCarregar.addEventListener("click", carregarVeiculos);

async function carregarVeiculos() {
    try {
        const resposta = await fetch(API);
        const dados = await resposta.json();

        listagem.innerHTML = ""; // limpa lista

        dados.forEach(m => criarVeiculo(m));

    } catch (erro) {
        console.error("Erro ao carregar:", erro.message);
    }
}

function criarVeiculo(v) {
    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td>${v.cpf_dono}</td>
        <td>${v.nome}</td>
        <td>${v.placa_veiculo}</td>
        <td>${v.ano}</td>
        <td>${v.nome_veiculo}</td>
        <td>${v.km_veiculo}</td>
    `;

    listagem.appendChild(tr);
}
