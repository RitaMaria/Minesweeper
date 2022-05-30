/* ------------------------------------------------------------------------- */
/* ITW 2021/2022 Grupo 66                                                    */
/* Filipe Dávila Fernandes, Nº 55981, PL26                                   */
/* Rita Rodrigues, Nº 54859, PL26                                            */
/* ------------------------------------------------------------------------- */
"use strict";

/* ------------------------------------------------------------------------- */
/*                                                                CONSTANTES */
/* ------------------------------------------------------------------------- */

/** Mensagem apresentada quando não existem rankings */
const MSG_NO_RANKINGS_AVAILABLE = "Não existem rankings de momento";

/** Identificador do select que permite selecionar a estatistica */
const SELECIONAR_ESTATISTICA = 'selEstatistica'

/** Identificador da div com o número de jogos ganhos. */
const RANKING_NUMERO_JOGOS = 'numeroJogosRanking';

/** Identificador da div com o tempo total a jogar */
const RANKING_TEMPO_TOTAL = 'tempoTotalRanking';

/** Identificador da div com o melhor tempo */
const RANKING_MELHOR_TEMPO = 'melhorTempoRanking';

/** Identificador da div com o tempo médio */
const RANKING_TEMPO_MEDIO = 'tempoMedioRanking';

/** Identificador da div com o número de vezes ganhas no modo multiplayer */
const RANKING_GANHOU_MULTIPLAYER = 'ganhouMultiplayerRanking';

/* ------------------------------------------------------------------------- */

/* ------------------------------------------------------------------------- */
/*                                                INICIALIZAÇÃO DA APLICAÇÃO */
/* ------------------------------------------------------------------------- */

window.addEventListener("load", principal);

/* ------------------------------------------------------------------------- */

/* ------------------------------------------------------------------------- */

/* ------------------------------------------------------------------------- */
/*                                                OBJETOS  DA APLICAÇÃO */
/* ------------------------------------------------------------------------- */

/** Utilizador autenticado */
var currentUser;

/** Objeto Rankings  , estrutura que guarda todos os registos dos rankings */
var rankings = {
    SpRankings: [],
    MpRankings: [],
    LostGames: []
}

/**Construtor do objeto Ranking que representa um registro do rankings
 *
 * @param rankingSp - array de  registos de Singleplayer games
 * @param rankingMp - array de  registos de Multiplayer games
 * @param lostGames - array de  registos de jogos perdidos
 * @constructor
 */
function Ranking(rankingSp, rankingMp, lostGames) {
    this.SpRankings = rankingSp;
    this.MpRankings = rankingMp;
    this.LostGames = lostGames;

}

/**
 * Primeira função a ser executada após o browser completar o carregamento
 * de toda a informação presente no documento HTML.
 */
function principal() {

    if (isLoggedIn()) {
        document.getElementById('selEstatistica').style.visibility = "visible";
        // Associar comportamento a elementos na página HTML.
        currentUser = JSON.parse(sessionStorage.getItem("user"));
        defineEventHandlersParaElementosHTML();
        initRankings();

    }
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

    document.getElementById(SELECIONAR_ESTATISTICA).
    addEventListener("click", mostraEstatistica);

}

/* ------------------------------------------------------------------------- */

/**
 * Mostra a div correspondente à estatistica que o utilizador selecionou
 */
function mostraEstatistica() {
    $("#rankingBox").empty();
    $("#titleBox").empty();
    let elems = document.querySelectorAll('#numeroJogosRanking, #tempoTotalRanking, #melhorTempoRanking, #tempoMedioRanking, #ganhouMultiplayerRanking, #melhorProporcaoRanking');
    for (let i = 0; i < elems.length; i++) {
        elems[i].style.display = 'none';
    }
    if (this.selectedIndex === 1) {

        mostraNumeroJogos();
    } else if (this.selectedIndex === 2) {

        mostraTempoTotal();
    } else if (this.selectedIndex === 3) {

        mostraMelhoresTempos();
    } else if (this.selectedIndex === 4) {
        showTopRankingSp()

    } else if (this.selectedIndex === 5) {
        showTopRankingMp();



    }
}


/* ------------------------------------------------------------------------- */
/*                                                      MOSTRAR ESTATÍSTICAS */
/* ------------------------------------------------------------------------- */


/**Função que mostra o contador de todos os jogos ganhos, no entnato também apresenta um contador para os perdidos
 * e o total de jogos feitos pelo utilizador */

function mostraNumeroJogos() {


    let rankingTop = document.createElement("table");
    rankingTop.setAttribute("class", "rankingTable");
    rankingTop.innerHTML += " <tr><th>Jogador</th><th>Jogos SP</th><th>Jogos MP</th> <th>Jogos Perdidos</th><th>Total</th>  </tr> ";

    let numPlayedGames = 0;
    let numSpGames = 0;
    let numMpGames = 0;
    let numLostGames = 0;
    let spGames = null;
    let mpGames = null;
    let lostGames = null;
    //caso existam registos no Single player mode
    if (rankings.SpRankings.length > 0) {
        spGames = rankings.SpRankings;
        //com uma função lambda conta-se cada jogo em que o utilizador ganhou
        spGames.forEach((game) => {
            if (game.nomePlayer == currentUser) {
                numSpGames++;
            };
        });
    }
    //caso existam registos no Multi player mode
    if (rankings.MpRankings.length > 0) {
        mpGames = rankings.MpRankings;
        //com uma função lambda conta-se cada jogo em que o utilizador ganhou
        mpGames.forEach((game) => {
            if (game.winner == currentUser) {
                numMpGames++;
            };
            if (game.loser == currentUser) {
                numLostGames++;
            }
        });

    }
    //caso existam registos em jogos perdidos
    if (rankings.LostGames.length > 0) {
        lostGames = rankings.LostGames;
        //com uma função lambda conta-se cada jogo em que o utilizador perdeu
        lostGames.forEach((game) => {
            if (game.nomePlayer === currentUser) {
                numLostGames++;
            };

        });
    }




    //efetua-se a soma de todos os jogos
    numPlayedGames = numSpGames + numMpGames + numLostGames;


    //insere-se na table estes resultados
    rankingTop.innerHTML += "<tr><td>" + currentUser + " </td>" +
        "<td>" + numSpGames + "</td><td>" + numMpGames + "</td>" +
        "<td>" + numLostGames + "</td><td>" + numPlayedGames + "</td></tr>";



    let divBox = document.getElementById("rankingBox");


    document.getElementById("titleBox").innerHTML += "<h1 className=''>Número de jogos </h1>";
    divBox.setAttribute("class", "ranking centeredDialog");

    divBox.appendChild(rankingTop);
    divBox.appendChild(rankingTop);

}



/* ------------------------------------------------------------------------- */

/** Mostra o top10 do tempo total a jogar */

/** Mostra o top10 do número de jogos ganhos */

function mostraTempoTotal() {


    let rankingTop = document.createElement("table");
    rankingTop.setAttribute("class", "rankingTable");
    rankingTop.innerHTML += " <tr><th>Jogador</th><th>Tempo SP</th><th>Tempo MP</th> <th>Tempo Jogos Perdidos</th><th>Tempo Total</th>  </tr> ";

    let timePlayedGames = 0;
    let timeSpGames = 0;
    let timeMpGames = 0;
    let timeLostGames = 0;

    let spGames = rankings.SpRankings;
    let mpGames = rankings.MpRankings;
    let lostGames = rankings.LostGames;


    spGames.forEach((game) => {
        if (game.nomePlayer == currentUser) {
            timeSpGames += game.timeGame;
        };
    });
    mpGames.forEach((game) => {
        if (game.winner == currentUser) {
            timeMpGames += game.timeGame;
        };
        if (game.loser == currentUser) {
            timeLostGames += game.timeGame;
        }
    });

    lostGames.forEach((game) => {
        if (game.nomePlayer === currentUser) {
            timeLostGames += game.timeGame;
        };

    });
    timePlayedGames = timeSpGames + timeMpGames + timeLostGames;



    rankingTop.innerHTML += "<tr><td>" + currentUser + " </td>" +
        "<td>" + timeSpGames + " sec" + "</td><td>" + timeMpGames + " sec" + "</td>" +
        "<td>" + timeLostGames + " sec" + "</td><td>" + timePlayedGames + " sec" + "</td></tr>";



    let divBox = document.getElementById("rankingBox");


    document.getElementById("titleBox").innerHTML += "<h1 className=''>Tempo Total de Jogo </h1>";
    divBox.setAttribute("class", "ranking centeredDialog");

    divBox.appendChild(rankingTop);
    divBox.appendChild(rankingTop);
}

/**Função que obtem
 *
 */
function mostraMelhoresTempos() {



    let rankingTop = document.createElement("table");
    rankingTop.setAttribute("class", "rankingTable");
    rankingTop.innerHTML += " <tr><th></th><th colspan='3'>Single Player Mode</th><th colspan='3'>Multiplayer Mode</th> </tr> ";
    rankingTop.innerHTML += " <tr><th>Jogador</th><th>EASY</th><th>MEDIUM</th> <th>HARD</th><th>EASY</th><th>MEDIUM</th> <th>HARD</th>  </tr> ";



    let spGames = rankings.SpRankings;
    let mpGames = rankings.MpRankings;

    // funções lambdas que procuram os jogos de cada tipo em que o current user participou e ganhou
    let easySp = spGames.find((game) => ((game.nomePlayer == currentUser) && (game.gameType == "EASY")));
    let mediumSp = spGames.find((game) => ((game.nomePlayer == currentUser) && (game.gameType == "MEDIUM")));
    let hardSp = spGames.find((game) => ((game.nomePlayer == currentUser) && (game.gameType == "HARD")));
    let easyMp = mpGames.find((game) => ((game.winner == currentUser) && (game.gameType == "EASY")));
    let mediumMp = mpGames.find((game) => ((game.winner == currentUser) && (game.gameType == "MEDIUM")));
    let hardMp = mpGames.find((game) => ((game.winner == currentUser) && (game.gameType == "HARD")));
    easySp = (easySp == undefined) ? "n/a" : easySp.timeGame + " sec";
    mediumSp = (mediumSp == undefined) ? "n/a" : mediumSp.timeGame + " sec";
    hardSp = (hardSp == undefined) ? "n/a" : hardSp.timeGame + " sec";
    easyMp = (easyMp == undefined) ? "n/a" : easyMp.timeGame + " sec";
    mediumMp = (mediumMp == undefined) ? "n/a" : mediumMp.timeGame + " sec";
    hardMp = (hardMp == undefined) ? "n/a" : hardMp.timeGame + " sec";

    rankingTop.innerHTML += "<tr><td>" + currentUser + " </td>" +
        "<td>" + easySp + "</td><td>" + mediumSp + "</td><td>" + hardSp + "</td><td>" +
        easyMp + "</td>" + "<td>" + mediumMp + "</td><td>" + hardMp + "</td></tr>";



    let divBox = document.getElementById("rankingBox");


    document.getElementById("titleBox").innerHTML += "<h1 className=''>Meus Melhores Tempos </h1>";
    divBox.setAttribute("class", "ranking centeredDialog");

    divBox.appendChild(rankingTop);
    divBox.appendChild(rankingTop);

}

/**Function verifica se é utilizador autenticado e caso contrario redireciona para a
 * pagina principal
 *
 */
function isLoggedIn() {
    let logged = true;
    //caso não exista o campo user no sessionstorage ai redireciona para o index.html
    if (sessionStorage.getItem("user") == undefined) {
        window.location.replace("index.html");
        logged = false;
    }
    return logged;

}


/**Função que inicia os rankings ou obtem os rankings atuais
 *
 */

function initRankings() {
    let loadRankings = getRankings();
    //caso o que tenha sido retornado do localstorage não exista, ai cria um ranking zerado
    if (loadRankings == null) {
        rankings = new Ranking(new Array(), new Array(), new Array());
    } else {
        rankings = JSON.parse(loadRankings);

    }


}


/**Função que obtem os rankings do local storage
 *
 * @returns {string}| null  - retorna os ranking em json ou null
 */
function getRankings() {
    return localStorage.getItem("rankings");

}


/**Função que apresenta os top 10 rankings do modo multiplayer
 *
 */
function showTopRankingSp() {
    // remove o rankings anterior
    $("#rankingBox").empty();
    //obtem o id
    let divBox = document.getElementById("rankingBox");


    //cria a table
    let rankingTop = document.createElement("table");
    rankingTop.setAttribute("class", "rankingTable");
    //ciar a table  heading
    rankingTop.innerHTML += " <tr><th>Nome Jogador</th><th>Pontos</th><th>Tempo Jogo</th> <th>Difficulty</th> </tr> ";

    //caso existam rankings
    if (rankings.SpRankings.length > 0) {
        let limit = 10;
        // caso o tamanhoo seja menor que 10 sabemos que o numero de elementos a tirar da lista vai ser menor
        if (rankings.SpRankings.length <= 10) {
            limit = rankings.SpRankings.length;
        }
        // fazemos um for na lista e selecionamos os primeiros scores pois a lista esta ordenada
        for (let i = 0; i < limit; i++) {
            if (rankings.SpRankings[i].nomePlayer == currentUser) {
                rankingTop.innerHTML += "<tr><td>" + rankings.SpRankings[i].nomePlayer + " </td>" +
                    "<td>" + rankings.SpRankings[i].points + "</td><td>" + rankings.SpRankings[i].timeGame + "</td> <td>" + rankings.SpRankings[i].gameType + "</td></tr>";
            }
        }
    } else {
        //caso não aja nenhum valor apresenta a mensagem de que não existem rankings
        rankingTop.innerHTML += "<tr><td colspan='4'>" + MSG_NO_RANKINGS_AVAILABLE + "</td></tr>";
    }

    divBox.setAttribute("class", "ranking centeredDialog");

    divBox.appendChild(rankingTop);
    divBox.appendChild(rankingTop);
}


/**Função que apresenta os top 10 rankings do modo multiplayer
 *
 */
function showTopRankingMp() {

    $("#rankingBox").empty();

    let rankingTop = document.createElement("table");
    rankingTop.setAttribute("class", "rankingTable");
    rankingTop.innerHTML += " <tr><th>Winner</th><th>Loser</th><th>Pontos Winner</th> <th>Pontos Loser</th><th>Tempo de Jogo</th>  </tr> ";
    console.log(rankings);
    //verifica se existem rankings
    if (rankings.MpRankings.length > 0) {
        let limit = 10;
        //verifica se o numero de rankings é inferior ou igual 10
        if (rankings.MpRankings.length <= 10) {
            limit = rankings.MpRankings.length;
        }
        for (let i = 0; i < limit; i++) {
            //caso o winner seja o utilizador currente ai adiciona esse valor a table , isto pois os dados estão ordenados na lista
            if (rankings.MpRankings[i].winner == currentUser) {
                rankingTop.innerHTML += "<tr><td>" + rankings.MpRankings[i].winner + " </td>" +
                    "<td>" + rankings.MpRankings[i].loser + "</td><td>" + rankings.MpRankings[i].pointsWinner + "</td>" +
                    "<td>" + rankings.MpRankings[i].pointsLoser + "</td><td>" + rankings.MpRankings[i].timeGame + "</td></tr>";
            }
        }
    } else {
        //caso não aja nenhum valor apresenta a mensagem de que não existem rankings
        rankingTop.innerHTML += "<tr><td colspan='5'>" + MSG_NO_RANKINGS_AVAILABLE + "</td></tr>";

    }


    let divBox = document.getElementById("rankingBox");

    divBox.setAttribute("class", "ranking centeredDialog");
    //coloca o elemento no html
    divBox.appendChild(rankingTop);
    divBox.appendChild(rankingTop);

}


/**Função que remove o ranking da pagina
 *
 */
function removeScore() {
    $("#rankingBox").empty();

}