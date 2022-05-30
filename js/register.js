/* ------------------------------------------------------------------------- */
/* ITW 2021/2022 Grupo 66                                                    */
/* Filipe Dávila Fernandes, Nº 55981, PL26                                   */
/* Rita Rodrigues, Nº 54859, PL26                                            */
/* ------------------------------------------------------------------------- */

// Impede alguns erros fáceis de cometer.
"use strict";

/* ------------------------------------------------------------------------- */
/*                                                                CONSTANTES */
/* ------------------------------------------------------------------------- */

/** Identificador do formulário para registar o jogador. */
const FORMULARIO_REGISTO = 'frmRegisto';

/** Identificador do botão de fazer registo. */
const BOTAO_FAZER_REGISTO = 'btnFazerRegisto';

/** Campo do formulário com o nome do jogador. */
const NOME_JOGADOR = 'nome';

/** Campo do formulário com o email do jogador. */
const EMAIL_JOGADOR = 'email';

/** Campo do formulário com a password do jogador. */
const PASS_JOGADOR = 'password';

/** Campo do formulário com a faixa etária do jogador. */
const FAIXA_ETARIA_JOGADOR = 'faixaEtaria';

/** Campo do formulário com o género do jogador. */
const GENERO_JOGADOR = 'genero';

/* ------------------------------------------------------------------------- */

/** Item de local storage que guarda os dados dos jogadores. */
const ITEM_JOGADORES = 'jogadores';

/* ------------------------------------------------------------------------- */
/*                                                         VARIÁVEIS GLOBAIS */
/* ------------------------------------------------------------------------- */

let formulario = null;


/**
 * Guarda o histórico de jogadores. Cada elemento do array deve ser um objeto
 * de tipo Jogador.
 */
let jogadores = [];

/* ------------------------------------------------------------------------- */
/*                                                   CONSTRUTORES DE OBJETOS */
/* ------------------------------------------------------------------------- */

/** Construtor de um objeto de tipo Jogador. Cada jogador tem um
 * nome, um email, uma password, uma faixa etaria, e um genero.
 *
 * @param {string} nome - Nome do jogador
 * @param {string} email - Email do jogador
 * @param {string} password - Password do jogador
 * @param {string} faixaEtaria - Faixa Etária do jogador
 * @param {string} genero - Genero do jogador
 */
function Jogador(nome, email, password, faixaEtaria, genero,tema) {
    this.nome = nome;
    this.email = email;
    this.password = password;
    this.faixaEtaria = faixaEtaria;
    this.genero = genero;
    this.tema = tema
}

/* ------------------------------------------------------------------------- */
/*                                                INICIALIZAÇÃO DA APLICAÇÃO */
/* ------------------------------------------------------------------------- */

window.addEventListener("load", principal);

/* ------------------------------------------------------------------------- */

/**
 * Primeira função a ser executada após o browser completar o carregamento
 * de toda a informação presente no documento HTML.
 */
function principal() {

    // Para simplificar o acesso aos elementos do formulário de registar jogadores.
    formulario = document.forms[FORMULARIO_REGISTO];

    // Carrega o histórico de jogadores a partir do local storage do browser.
    carregaHistoricoJogadores();

    // Associar comportamento a elementos na página HTML.
    defineEventHandlersParaElementosHTML();

}


/* ------------------------------------------------------------------------- */
/*                                            REAÇÃO A EVENTOS DO UTILIZADOR */
/* ------------------------------------------------------------------------- */

/**
 * Associa event handlers a elementos no documento HTML, em particular botões.
 * Com esta abordagem, evitam-se atributos onclick ou similares, e faz-se uma
 * melhor separação entre conteúdo, em HTML, e comportamento, em JavaScript.
 */
function defineEventHandlersParaElementosHTML() {

    document.getElementById(BOTAO_FAZER_REGISTO).
    addEventListener("click", trataRegistarJogador);

}

/* ------------------------------------------------------------------------- */

/**
 * Obtém os dados do jogador que constam no formulário de registo.
 *
 * @returns {Jogador} Objeto com os dados do jogador.
 */
function obtemDadosJogador() {

    let nome = formulario.elements[NOME_JOGADOR].value;
    let email = formulario.elements[EMAIL_JOGADOR].value;
    let password = formulario.elements[PASS_JOGADOR].value;
    let faixaEtaria = formulario.elements[FAIXA_ETARIA_JOGADOR].value;
    let genero = null;
    for (let g of formulario.elements[GENERO_JOGADOR]) {
        if (g.checked) {
            genero = g.value;
        }
    }

    let tema = $("#theme").val();


    return new Jogador(nome, email, password, faixaEtaria, genero,tema);
}

/* ------------------------------------------------------------------------- */

/**
 * Trata os dados do registo de um jogador, provenientes do formulário HTML.
 */
function trataRegistarJogador() {

    let jogadorValido = formulario.reportValidity();

    // Se o formulário estiver bem preenchido, guarda os dados do jogador
    let jogadores = null;

    if (jogadorValido) {

        let jogador = obtemDadosJogador();

        gravaJogadorNoHistorico(jogador);

        formulario.reset();
        window.location.replace("index.html");

    }
}

/* ------------------------------------------------------------------------- */
/*                                         GESTÃO DO HISTÓRICO DE JOGADORES  */
/* ------------------------------------------------------------------------- */

/**
 * Carrega o histórico de encomendas guardado no local storage do browser.
 */
function carregaHistoricoJogadores() {

    jogadores = JSON.parse(localStorage.getItem(ITEM_JOGADORES)) || [];

}

/* ------------------------------------------------------------------------- */

/**
 * Grava o histórico de jogadores no local storage do browser.
 */
function gravaHistoricoJogadores() {

    localStorage.setItem(ITEM_JOGADORES, JSON.stringify(jogadores));

}

/* ------------------------------------------------------------------------- */

/**
 * Grava o jogador no histórico de jogadores.
 *
 * @param {Jogador} jogador - Objeto com os dados do jogador.
 */
function gravaJogadorNoHistorico(jogador) {

    jogadores.push(jogador);
    gravaHistoricoJogadores();

}

/* ------------------------------------------------------------------------- */