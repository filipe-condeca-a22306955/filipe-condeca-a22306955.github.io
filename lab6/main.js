
// A declaraçao de vars

const nodeInputNumero = document.querySelector("#colecao ~ section input[type='number']");
const nodeInputSubmit = document.querySelector("#colecao ~ section input[type='submit']");
const nodeUlColecao = document.querySelector("#colecao ul");
const nodeTotalCromos = document.querySelector("#colecao > h3 span");

const nodeUlRepetidos = document.querySelector("#colecao #repetidos ul");
const nodeTotalRepetidos = document.querySelector("#colecao #repetidos h3 span");

const colecao = JSON.parse(localStorage.getItem("colecao")) || [];
const repetidos = JSON.parse(localStorage.getItem("repetidos")) || [];

let totalRepetidos = repetidos.length;


// B event handlers

function guardaLocalStorage() {
    localStorage.setItem("colecao", JSON.stringify(colecao));
    localStorage.setItem("repetidos", JSON.stringify(repetidos));
}

function guardaCarta() {
    const numero = Number(nodeInputNumero.value);

    if (colecao.includes(numero)) {
        repetidos.push(numero);
        repetidos.sort((a, b) => a - b);

        totalRepetidos++;
        atualizaLista(repetidos, nodeUlRepetidos);
        nodeTotalRepetidos.textContent = totalRepetidos;
    } else {
        colecao.push(numero);
        colecao.sort((a, b) => a - b);

        atualizaLista(colecao, nodeUlColecao);
    }

    nodeTotalCromos.textContent = colecao.length + repetidos.length;

    guardaLocalStorage();
    nodeInputNumero.value = "";
}

function atualizaLista(lista, nodeUl) {
    nodeUl.innerHTML = "";

    lista.forEach(function(cromo, index) {
        if (nodeUl === nodeUlRepetidos) {
            nodeUl.innerHTML +=
                `<li>${cromo} <button class="btn-eliminar" data-index="${index}">Eliminar</button></li>`;
        } else {
            nodeUl.innerHTML += `<li>${cromo}</li>`;
        }
    });

    nodeTotalCromos.textContent = colecao.length + repetidos.length;

    if (nodeUl === nodeUlRepetidos) {
        associaEventosEliminar();
    }
}

function associaEventosEliminar() {
    const botoesEliminar = document.querySelectorAll("#repetidos .btn-eliminar");

    botoesEliminar.forEach(function(botao) {
        botao.onclick = function() {
            const index = Number(botao.dataset.index);

            repetidos.splice(index, 1);
            totalRepetidos--;

            guardaLocalStorage();

            atualizaLista(repetidos, nodeUlRepetidos);
            nodeTotalRepetidos.textContent = totalRepetidos;
            nodeTotalCromos.textContent = colecao.length + repetidos.length;
        };
    });
}


// C event listeners

const form = document.querySelector("#colecao ~ section form");

form.onsubmit = (event) => {
    event.preventDefault();
    guardaCarta();
};


// D inicialização para mostrar dados guardados na storage

atualizaLista(colecao, nodeUlColecao);
atualizaLista(repetidos, nodeUlRepetidos);

nodeTotalCromos.textContent = colecao.length + repetidos.length;
nodeTotalRepetidos.textContent = totalRepetidos;
