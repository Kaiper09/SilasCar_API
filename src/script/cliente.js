const API = "http://localhost:3000/clientes";

const btnCarregar = document.getElementById("carregar_clientes");
const listagem = document.getElementById("listagem");

btnCarregar.addEventListener("click", carregarClientes);

async function carregarClientes() {
    try {
        const resposta = await fetch(API);
        const dados = await resposta.json();

        listagem.innerHTML = ""; // limpa lista

        dados.forEach(m => criarCliente(m));

    } catch (erro) {
        console.error("Erro ao carregar:", erro.message);
    }
}

function criarCliente(c) {
    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td>${c.cpf}</td>
        <td>${c.nome}</td>
        <td>${c.nascimento}</td>
        <td>${c.numero}</td>
        <td>${c.cidade}</td>
        <td>${c.situacao}</td>
    `;

    const tdBotao = document.createElement("td");
    const botao = document.createElement("button");

    // evento
    botao.addEventListener("click", function () {
        abrirModal(c);
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

function abrirModal(cliente) {
    document.getElementById("modal").style.display = "block";

    document.getElementById("cliente-cpf").value = cliente.cpf;
    document.getElementById("cliente-nome").value = cliente.nome;
    document.getElementById("cliente-nascimento").value = formatarDataParaInput(cliente.nascimento);
    document.getElementById("cliente-numero").value = cliente.numero;
    document.getElementById("cliente-cidade").value = cliente.cidade;
     document.getElementById("situacao").value = cliente.situacao.toLowerCase();
   
}




