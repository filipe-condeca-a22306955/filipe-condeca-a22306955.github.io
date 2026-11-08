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

function renderizarProdutos(produtos){
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
        total += produto.price;
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


atualizaCesto();
