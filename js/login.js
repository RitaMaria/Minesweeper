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

/** Identificador do formulário para fazer o login do jogador. */
const FORMULARIO_LOGIN = 'frmLogin';

/** Identificador do botão de fazer login. */
const BOTAO_FAZER_LOGIN = 'btnFazerLogin';

/** Identificador do botão para ir para o registo. */
const BOTAO_IR_REGISTO = 'btnIrRegisto';

/** Campo do formulário de login com o nome do jogador. */
const NOME_JOGADOR_LOGIN = 'nomeLogin';

/** Campo do formulário de login com a pass do jogador. */
const PASS_JOGADOR_LOGIN = 'passLogin';

/** Identificador do páragrafo de informações sobre o login. */
const INFO_LOGIN = 'infoLogin';

/** Identificador do link para o username */
const LINK_USERNAME = 'username';

/* ------------------------------------------------------------------------- */

/** Item de local storage que guarda os dados dos jogadores. */
const ITEM_JOGADORES = 'jogadores';

/** Item de local storage da escolha de tema do utilizador. */
const ITEM_TEMA = "theme";
/** Item de local storage que guarda o nome do utilizador corrente. */
const ITEM_USER = 'user';

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
/*                                                INICIALIZAÇÃO DA APLICAÇÃO */
/* ------------------------------------------------------------------------- */

window.addEventListener("DOMContentLoaded", principal);

/* ------------------------------------------------------------------------- */

/**
 * Primeira função a ser executada após o browser completar o carregamento
 * de toda a informação presente no documento HTML.
 */
function principal() {

    // Para simplificar o acesso aos elementos do formulário de registar jogadores.
    formulario = document.forms[FORMULARIO_LOGIN];

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

    document.getElementById(BOTAO_FAZER_LOGIN).
    addEventListener("click", verificaLogin);

    document.getElementById(BOTAO_IR_REGISTO).
    addEventListener('click', irRegisto);
}

/* ------------------------------------------------------------------------- */
/*                                         GESTÃO DO HISTÓRICO DE JOGADORES */
/* ------------------------------------------------------------------------- */

/**
 * Carrega o histórico de encomendas guardado no local storage do browser.
 */
function carregaHistoricoJogadores() {

    jogadores = JSON.parse(localStorage.getItem(ITEM_JOGADORES)) || [];

}

/* ------------------------------------------------------------------------- */

/** Verifica se o jogador está registado, e se isso se verificar
 * verifica se colocou a pass correta.
 */
function verificaLogin() {

    let pInfoLogin = document.getElementById(INFO_LOGIN);

    let linkUsername = document.getElementById(LINK_USERNAME);

    let nomeLogin = formulario.elements[NOME_JOGADOR_LOGIN].value;

    let passLogin = formulario.elements[PASS_JOGADOR_LOGIN].value;

    for (let j of jogadores) {
        if (nomeLogin == j.nome && passLogin == j.password) {
            pInfoLogin.innerHTML = 'Sessão iniciada.';
            linkUsername.innerHTML = nomeLogin;
            linkUsername.setAttribute('href', 'user.html');
            sessionStorage.setItem(ITEM_USER, JSON.stringify(nomeLogin));
            sessionStorage.setItem(ITEM_TEMA, JSON.stringify(j.tema));
            window.location.reload();
            break;
        } else if (nomeLogin == j.nome && passLogin != j.password) {
            pInfoLogin.innerHTML = 'Palavra passe errada.';
            break;
        } else {
            pInfoLogin.innerHTML = 'Utilizador não registado.';
        }
    }

    if (jogadores.length === 0) {
        pInfoLogin.innerHTML = 'Utilizador não registado.';
    }
}

/* ------------------------------------------------------------------------- */

/**
 * Vai para a pagina de Registo.
 */
function irRegisto() {
    window.location = 'register.html';
}