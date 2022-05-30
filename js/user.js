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

/** Identificador do parágrafo com o nome do jogador. */
const NOME_JOGADOR = 'nomeJogador';

/** Identificador do parágrafo com o email do jogador. */
const EMAIL_JOGADOR = 'emailJogador';

/** Identificador do parágrafo com a faixa etária do jogador. */
const FAIXA_ETARIA_JOGADOR = 'faixaEtariaJogador';

/** Identificador do parágrafo com o género do jogador. */
const GENERO_JOGADOR = 'generoJogador';

/** Identificador do link para o username. */
const LINK_USERNAME = 'username';

/** Identificador do botão para fazer logout. */
const BOTAO_FAZER_LOGOUT = 'btnFazerLogout';


/* ------------------------------------------------------------------------- */

/** Item de local storage que guarda os dados dos jogadores. */
const ITEM_JOGADORES = 'jogadores';

/** Item de local storage que guarda o nome do utilizador corrente. */
const ITEM_USER = 'user';

/* ------------------------------------------------------------------------- */
/*                                                         VARIÁVEIS GLOBAIS */
/* ------------------------------------------------------------------------- */


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
    isLoggedIn();
    // Carrega o histórico de jogadores a partir do local storage do browser.
    carregaHistoricoJogadores();

    mostraDadosUtilizador();

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

    document.getElementById(BOTAO_FAZER_LOGOUT).
      addEventListener("click", trataFazerLogout);
  
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
 * Mostra os dados do utilizador
 */
function mostraDadosUtilizador() {

    let user = JSON.parse(sessionStorage.getItem(ITEM_USER)) || 'Login';

    for (let j of jogadores) {
        if (user == j.nome) {
            document.getElementById(NOME_JOGADOR).innerHTML = j.nome;
            document.getElementById(EMAIL_JOGADOR).innerHTML = j.email;
            document.getElementById(FAIXA_ETARIA_JOGADOR).innerHTML = j.faixaEtaria;
            document.getElementById(GENERO_JOGADOR).innerHTML = j.genero;
            break;
        } else {
            document.getElementById(NOME_JOGADOR).innerHTML = '';
            document.getElementById(EMAIL_JOGADOR).innerHTML = '';
            document.getElementById(FAIXA_ETARIA_JOGADOR).innerHTML = '';
            document.getElementById(GENERO_JOGADOR).innerHTML = '';
        }
    }

}

/* ------------------------------------------------------------------------- */

/**
 * Faz logout
 */

function trataFazerLogout() {

    sessionStorage.clear();

    mostraDadosUtilizador();

    window.location = 'index.html';

}

/**Function verifica se é utilizador autenticado e caso contrario redireciona para a
 * pagina principal
 *
 */
function isLoggedIn(){
    if(sessionStorage.getItem("user") == undefined){
        window.location.replace("index.html");

    }
}