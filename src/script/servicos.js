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
const tdBotao = document.createElement("td");
    const botao = document.createElement("button");

    // evento
    botao.addEventListener("click", function () {
        abrirModal(s);
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

function formatarDataParaInput(dataBR) {
    if (!dataBR) return "";

    const partes = dataBR.split("/");
    return `${partes[2]}-${partes[1]}-${partes[0]}`;
}


function abrirModal(servicos) {
    document.getElementById("modal").style.display = "block";

    document.getElementById("s-id").value = servicos;
    document.getElementById("s-placa").value = servicos.placa_veiculo_id;
    document.getElementById("s-nome-dono").value = servicos.nome;
    document.getElementById("s-servico").value= servicos.trabalho_feito
    document.getElementById("s-data").value = formatarDataParaInput(servicos.data);
    document.getElementById("s-valor").value = servicos.valor_servico;
     document.getElementById("s-situacao").value = servicos.situacao;
   
}
