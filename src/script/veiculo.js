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
    const tdBotao = document.createElement("td");
    const botao = document.createElement("button");

    
    botao.addEventListener("click", function () {
        abrirModal(v);
    });

    // ícone Lucide
    botao.innerHTML = `<i data-lucide="eye"></i>`; 
    botao.classList.add("btn-detalhes");

    tdBotao.appendChild(botao);
    tr.appendChild(tdBotao);
    listagem.appendChild(tr);

    // renderiza o ícone
    lucide.createIcons();
}


function abrirModal(veiculo) {
    document.getElementById("modal").style.display = "block";

    document.getElementById("v-cpf_dono").value = veiculo.cpf_dono;
    document.getElementById("v-nome").value = veiculo.nome;
    document.getElementById("v-placa").value = veiculo.placa_veiculo;
    document.getElementById("v-ano").value = veiculo.ano;
    document.getElementById("v-nome_veiculo").value = veiculo.nome_veiculo;
    document.getElementById("v-km").value = veiculo.km_veiculo;
}