let produtos=[];



// A. Vars e Estados
const divProdutos = document.querySelector('.lista-produtos');
const divCesto = document.querySelector('.cesto-produtos');

if (localStorage.getItem("produtos-selecionados") === null) {
    localStorage.setItem("produtos-selecionados", JSON.stringify([]));
}

// B. Funções utilitárias
function criarProduto(produto){
    const article=document.createElement('article');

    const titulo=document.createElement('h3');
    titulo.textContent=produto.title;
    article.append(titulo);

    const imagem= document.createElement('img');
    imagem.src='https://deisishop.pw.deisi.ulusofona.pt' + produto.image;
    article.append(imagem);

    const description=document.createElement('p');
    description.textContent=produto.description;
    article.append(description);

    const price=document.createElement('h4');
    price.textContent = `Preço: ${produto.price} €`;
    article.append(price);


    const botao = document.createElement('button');
    botao.textContent = '+ Adicionar ao cesto';
    article.append(botao);

    botao.addEventListener('click', function() {
        let produtos = JSON.parse(localStorage.getItem('produtos-selecionados'));

        produtos.push(produto);

        localStorage.setItem('produtos-selecionados', JSON.stringify(produtos));

        atualizaCesto();
    });
    return article;
}

function criaProdutoCesto(produto){
    const article=document.createElement('article');

    const titulo=document.createElement('h3');
    titulo.textContent=produto.title;
    article.append(titulo);

    const imagem= document.createElement('img');
    imagem.src='https://deisishop.pw.deisi.ulusofona.pt' + produto.image;
    article.append(imagem);


    const botao = document.createElement('button');
    botao.textContent = 'Remover do cesto';
    article.append(botao);

    botao.addEventListener('click', function() {
        let produtos = JSON.parse(localStorage.getItem('produtos-selecionados'));

        const index = produtos.findIndex(p => p.id === produto.id);

        if (index !== -1) {
            produtos.splice(index, 1);
        }

        localStorage.setItem('produtos-selecionados', JSON.stringify(produtos));

        atualizaCesto();
    });

    return article;
}

// C. Event handlers

function renderizarProdutos(produtos) {

    divProdutos.innerHTML = "";

    produtos.forEach(produto => {
        divProdutos.append(criarProduto(produto));
    });
}

function atualizaCesto() {
    const produtos = JSON.parse(localStorage.getItem('produtos-selecionados'));

    divCesto.innerHTML = '';

    let total = 0;

    produtos.forEach(function(produto) {
        divCesto.append(criaProdutoCesto(produto));
        total += Number(produto.price);
    });

    document.querySelector('.preco-total').textContent = `Preço total: ${total.toFixed(2)} €`;
}

// D. Inicialização

async function obterDados() {
    const resposta = await fetch('https://deisishop.pw.deisi.ulusofona.pt/products');

    const dados = await resposta.json();

    produtos=dados;
    renderizarProdutos(produtos);
}
obterDados();


async function carregarCategorias() {
    const response = await fetch("https://deisishop.pw.deisi.ulusofona.pt/categories");
    const categorias = await response.json();

    const select = document.getElementById("categoria");

    categorias.forEach(categoria => {
        const option = document.createElement("option");
        option.value = categoria.name;
        option.textContent = categoria.name;
        select.appendChild(option);
    });
}
carregarCategorias();

function atualizarProdutos() {

    const categoriaSelecionada =
        document.getElementById("categoria").value;

    const ordenacao =
        document.getElementById("ordenacao").value;

    const textoPesquisa =
        document.getElementById("pesquisa").value.toLowerCase();

    let lista = [...produtos];

    // filtro por categoria
    if (categoriaSelecionada !== "") {
        lista = lista.filter(
            produto => produto.category === categoriaSelecionada
        );
    }

    // filtro por texto
    if (textoPesquisa !== "") {
        lista = lista.filter(
            produto => produto.title
                .toLowerCase()
                .includes(textoPesquisa)
        );
    }

    // ordenação
    if (ordenacao === "asc") {
        lista.sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (ordenacao === "desc") {
        lista.sort((a, b) => Number(b.price) - Number(a.price));
    }

    renderizarProdutos(lista);
}

async function comprar() {

    const produtosCesto = JSON.parse(localStorage.getItem("produtos-selecionados"));

    const idsProdutosCompra = produtosCesto.map(produto => produto.id);


    const response = await fetch(
        "https://deisishop.pw.deisi.ulusofona.pt/buy",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                products: idsProdutosCompra,
                student: document.getElementById("student").checked,
                coupon: document.getElementById("coupon").value
            })
        }
    );

    const dados = await response.json();

    if (dados.error) {
        alert(dados.error);
        return;
    }

    document.getElementById("total").textContent =
        dados.totalCost + " €";

    document.getElementById("referencia").textContent =
        dados.reference;
}


document.getElementById("categoria")
    .addEventListener("change", atualizarProdutos);

document.getElementById("ordenacao")
    .addEventListener("change", atualizarProdutos);

document.getElementById("pesquisa")
    .addEventListener("input", atualizarProdutos);

document
    .getElementById("comprar")
    .addEventListener("click", comprar);

atualizaCesto();
