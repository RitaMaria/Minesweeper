/* ------------------------------------------------------------------------- */
/* ITW 2021/2022 Grupo 66                                                    */
/* Filipe Dávila Fernandes, Nº 55981, PL26                                   */
/* Rita Rodrigues, Nº 54859, PL26                                            */
/* ------------------------------------------------------------------------- */

/* ------------------------------------------------------------------------- */
"use strict";
/* ------------------------Game Screens IDS--------------------------- */
/**  Current page */
var path = window.location.pathname;
var currentDirectory = path.substring(0, path.lastIndexOf('/'));

window.addEventListener("DOMContentLoaded", isLoggedIn);
/** Tempo do jogo SINGLE PLAYER e QuickGame */
const ID_SPAN_TEMPO_JOGO = "idScreenTempoJogo";

/** Tempo do jogo SINGLE PLAYER e QuickGame */
const ID_SPAN_TEMPO_JOGOP2 = "idScreenTempoJogoP2";

/** Tempo do jogo SINGLE PLAYER e QuickGame */
const ID_BOMBS_REMAINED = "idBombsRemained";

/** Tempo do jogo SINGLE PLAYER e QuickGame */
const ID_BOMBS_REMAINED_P1 = "idBombsRemained1";


/** Tempo do jogo SINGLE PLAYER e QuickGame */
const ID_BOMBS_REMAINED_P2 = "idBombsRemained2";


/**  Times Won MULTIPLAYER P1 Information **/

const ID_TIMES_WON_MULTIPLAYER_P1 = "timesWonPlayer1";

/**  Times Won MULTIPLAYER P2 Information **/

const ID_TIMES_WON_MULTIPLAYER_P2 = "timesWonPlayer2";

/**  ID points game SinglePlayer **/

const ID_POINTS_SINGLEPLAYER = "idPointsSinglePlayer";

/**  ID points game Multiplayer P1 **/

const ID_POINTS_MULTIPLAYER_P1 = "idPointsPlayer1";

/**  ID points game Multiplayer P2 **/

const ID_POINTS_MULTIPLAYER_P2 = "idPointsPlayer2";

/**  choose dificulty SinglePlayer */

const FORM_GAME_DIFFICULTY_SP = "formGameTypeSp";




/** Intervalo do tempo do jogo */
var temporizadorTempoJogo;

/** Intervalo de atualização de pontuação */
var verificacaoPontos;


/* ------------------------Game Buttons--------------------------- */

/** Restart Game SinglePlayer do tempo do jogo */

const BTN_ID_RESET_GAME_SP = "idResetGame";

/** Restart Game Multiplayer player 1 */

const BTN_ID_RESET_GAME_MP_P1 = "smileP1";

/** Restart Game Multiplayer Player 2 */

const BTN_ID_RESET_GAME_MP_P2 = "smileP2";




/* ------------------------Game Tables--------------------------- */

/** Game Table SINGLE PLAYER */

const ID_TABLE_SINGLEPLAYER = "idGameTable";

/** Game Table SINGLE PLAYER */

const ID_TABLE_MULTIPLAYER_P1 = "idGameTableP1";


/** Game Table SINGLE PLAYER */

const ID_TABLE_MULTIPLAYER_P2 = "idGameTableP2";

/* ------------------------Game OPTIONS--------------------------- */

/** Numero de bombas modo EASY */
const BOMBS_GAME_EASY = 10;

/** Numero de bombas modo MEDIUM */
const BOMBS_GAME_MEDIUM = 40;

/** Numero de bombas modo HARD */
const BOMBS_GAME_HARD = 99;

/** Pontuação ganha por cada Celula Aberta */

const POINTS_GIVEN_OPENED_CELL = 1;


/* ------------------------Game MSG--------------------------- */

/** Mensagem Jogo Ganho */
const MSG_WIN_SP = "Ganhou o Jogo";

/** Mensagem Jogo Perdido */
const MSG_LOSE_SP = "Perdeu! Tenta Outra vez!";

/** Mensagem Jogo Ganho */
const MSG_WIN_MP = "Ganhou o Jogo contra";

/** Mensagem Jogo Perdido */
const MSG_LOSE_MP = "Perdeu !Não há vencedores";

/** Identificador do formulário para escolher as opções de um jogo multiplayer */
const FORMULARIO_MULTIPLAYER = 'frmMultiPlayerSettings';

/** Id do span de visualização do turno atual do player 1*/
const ID_SPAN_PLAYER_TURN = "idTurnPlayer";

/** Id do span de visualização do turno atual do player 2*/
const ID_SPAN_PLAYER2_TURN = "idTurnPlayer2";

/* --------------------------Rankings------------------------------ */

/** Nome do registro de rankings no localStorage*/
const LOCALSTORAGE_KEY_RANKINGS = "rankings";

/** Mensagem disponibilizada quando não existem registros*/
const MSG_NO_SCORES_AVAILABLE = "Ainda Não existem Registos";

/* --------------------------Sons do Jogo------------------------------ */

/** Objeto de audio do som de abertura de uma celula do jogo*/
var openedCellSound = new Audio(currentDirectory + '/audio/open.mp3');

/** Objeto de audio do som de explosão de uma mina do jogo*/
var cellExplodedSound = new Audio(currentDirectory + '/audio/explode.mp3');

/** Objeto de audio do som de ultima mina sinalizado com bandeira e jogo ganho*/
var wonGameSound = new Audio(currentDirectory + '/audio/win.mp3');

/** Objeto de audio do som de ambiente do jogo*/
var musicGame = new Audio(currentDirectory + '/audio/creative.mp3');

/** Objeto de audio do som de colocação de uma bandeira no jogo*/
var placingFlag = new Audio(currentDirectory + '/audio/flag.mp3');

/** Objeto de audio do som de colocação de uma suspeita na celula jogo*/
var question = new Audio(currentDirectory + '/audio/question.mp3');


/** Variavel booleana que mostra se é verdade que o som de ambiente está ligado */
var isMusicOn = true;

/**Função que apresenta um numero com varios 0 a sua esquerda de acordo com os parametros dados
 * que implicam diretamente no numero de 0 que iram ser apresentados no numero dado
 *
 * @param num - numero em causa
 * @param places - numero de zeros a adicionar
 * @returns {string} - representação textual deste numero
 */
var zeroPad = (num, places) => {
    // se o numero é positivo retorna o mesmo com a quantidade de zeros pedida
    if (num >= 0) {
        return String(num).padStart(places, '0');
    } else {
        // se o numero é negativo apresenta um 0 com um menos
        num = Math.abs(num);
        return String(num).padStart(places, '-0');
    }
};


/**Objeto que representa o jogo atual e contem a informação crucial sobre o jogo atual e funções para lidar com esta informação
 * estando preparado para um jogador unico a dois jogadores.
 *
 * @type {{resetData: jogo.resetData, times_won_player: *[], inicio: null, turns_played: number, finished: boolean, turn: number, addTimeWonP1: jogo.addTimeWonP1, addTimeWonP2: jogo.addTimeWonP2, resetGameMp: jogo.resetGameMp, difficulty: null, name_player: *[], size: null, resetGameSp: jogo.resetGameSp, nextTurn: jogo.nextTurn, table_player: *[], times_won_player1: number, times_won_player2: number}}
 */
const jogo = {
    table_player: [],
    name_player: [],
    inicio: null,
    times_won_player1: 0,
    times_won_player2: 0,
    times_won_player: [],
    turn: 0,
    turns_played: 0,
    nextTurn: function() {
        //função segue para proximo turno
        this.turn = (this.turn + 1) % this.name_player.length;
        this.turns_played++;
    },
    difficulty: null,
    size: null,
    finished: false,
    addTimeWonP1: function() {
        //adiciona numero de vezes ganhas ao jogador 1
        this.times_won_player1++;
        document.getElementById(ID_TIMES_WON_MULTIPLAYER_P1).innerText = zeroPad(this.times_won_player1, 2);

    },
    addTimeWonP2: function() {
        //adiciona numero de vezes ganhas ao jogador 2
        this.times_won_player2++;
        document.getElementById(ID_TIMES_WON_MULTIPLAYER_P2).innerText = zeroPad(this.times_won_player2, 2);

    },
    resetGameSp: function() {
        //faz reset da table de jogo e todas as suas celulas e temporizador de pontos
        // por sua vez chama a função para reset da informação de jogo para o modo singlePlayer
        verificacaoPontos = setInterval(updatePointsSP, 300);
        jogo.table_player[0].resetTable();
        jogo.resetData();

    },
    resetData: function() {
        // faz reset dos temporizadores e das informações do jogo
        temporizadorTempoJogo = setInterval(mostraTempoJogo, 1000);
        jogo.won = false;
        jogo.lost = false;
        jogo.turns_played = 0;
        jogo.finished = false;
        jogo.inicio = Math.floor(Date.now() / 1000);
        removeScore();

    },
    resetGameMp: function() {
        //faz reset das tables de jogo e todas as suas celulas e temporizadores
        // por sua vez chama a função para reset da informação
        jogo.table_player.forEach((table) => {
            table.resetTable();
        })
        jogo.resetData();
        verificacaoPontos = setInterval(updatePointsMP, 300);

    }

};

/**Array que guarda registos de jogadores
 *
 * @type {*[]}
 */
let jogadores = [];

/** Objeto Rankings  , estrutura que guarda todos os registos dos rankings
 *
 * @type {{LostGames: *[], SpRankings: *[], MpRankings: *[]}}
 */
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

/**Construtor tipo objecto RankingSp que guarda informação sobre o ranking
 * de um jogo SinglePlayer
 *
 * @param nome - nome do jogador
 * @param points - pontos do jogo
 * @param time - tempo decorrido para ganhar
 * @param gameType - tipo de jogo
 * @constructor
 */
function RankingSP(nome, points, time, gameType) {
    this.nomePlayer = nome;
    this.points = points;
    this.timeGame = time;
    this.gameType = gameType;
}

/**Construtor tipo objecto RankingMp que guarda informação sobre o ranking
 * de um jogo multplayer
 * @param winner -Jogador que ganhou
 * @param loser - Jogador que perdeu
 * @param pointsWinner - Pontos do jogador que ganhou
 * @param pointsLoser - Pontos do jogador que perdeu
 * @param timeGame - tempo do jogo decorrido
 * @param gameType - tipo de jogo
 * @constructor
 */
function RankingMP(winner, loser, pointsWinner, pointsLoser, timeGame, gameType) {
    this.winner = winner;
    this.loser = loser;
    this.pointsWinner = pointsWinner;
    this.pointsLoser = pointsLoser;
    this.timeGame = timeGame;
    this.gameType = gameType;
}

/**Construtor tipo objecto LostGame que guarda informação sobre o jogo perdido
 *
 * @param name - nome do jogador
 * @param time - tempo de jogo
 * @constructor
 */
function LostGame(name, time) {
    this.nomePlayer = name;
    this.timeGame = time;
}
/* ------------------------------------------------------------------------- */
/**Function verifica se é utilizador autenticado e caso contrario redireciona para a
 * pagina principal
 *
 */
function isLoggedIn() {
    if (sessionStorage.getItem("user") == undefined) {
        window.location.replace("index.html");

    }

}

/**Função que inicia os rankings pedidndo os registos do localstorare por via de outra função e caso os mesmos
 * não existam cria um objeto do Tipo Ranking vazio
 *
 */
function initRankings() {
    let loadRankings = getRankings();
    if (loadRankings == null) {
        rankings = new Ranking(new Array(), new Array(), new Array());

    } else {
        rankings = JSON.parse(loadRankings);
    }

}

/**Função que obtem os rankings atuais ou caso os mesmos não existam cria e devolve um
 *
 * @returns {string} - registo dos rankings do localstorage
 */

function getRankings() {
    return localStorage.getItem(LOCALSTORAGE_KEY_RANKINGS);

}

/**Function to set ranking of singleplayer game in local Storage
 *
 * @param nome - name of player
 * @param score - score of player
 * @param time - time of game
 */
function setRankingSP(nome, score, time, gametype) {

    let thisRanking = new RankingSP(nome, score, time, gametype);
    //introduz o registo no ranking
    rankings.SpRankings.push(thisRanking);
    //depois de introduzir o registo organiza os registos

    // função que usa uma função lambda com dos argumentos e que sorteia os elementos na lista
    //baseando nos padrões da função sort
    rankings.SpRankings.sort((a, b) => {
        return a.timeGame - b.timeGame;
    })

    //por fim coloca o item no localstorage
    localStorage.setItem(LOCALSTORAGE_KEY_RANKINGS, JSON.stringify(rankings));



}
/**Function to set Lost Games in local Storage
 *
 * @param nome - name of player
 * @param score - score of player
 * @param time - time of game
 */
function setLostGame(nome, time) {
    console.log(rankings);
    let thisRanking = new LostGame(nome, Number(time));

    rankings.LostGames.push(thisRanking);

    localStorage.setItem(LOCALSTORAGE_KEY_RANKINGS, JSON.stringify(rankings));



}

/**Function to set Rankings of multiplayer in localstorage
 *
 * @param winner - name of winner
 * @param loser - name of looser
 * @param pointsWinner - points of winner
 * @param pointsLoser - points of loser
 * @param timeGame - time of game
 */
function setRankingMP(winner, loser, pointsWinner, pointsLoser, timeGame, gametype) {

    let thisRanking = new RankingMP(winner, loser, pointsWinner, pointsLoser, Number(timeGame), gametype);

    //introduz o registo no ranking
    rankings.MpRankings.push(thisRanking);

    //depois de introduzir o registo organiza os registos

    // função que usa uma função lambda com dos argumentos e que sorteia os elementos na lista
    //baseando nos padrões da função sort
    rankings.MpRankings.sort((a, b) => {
        return a.timeGame - b.timeGame;
    })
    //por fim coloca o item no localstorage
    localStorage.setItem(LOCALSTORAGE_KEY_RANKINGS, JSON.stringify(rankings));



}

/**Função que mostra os top 10 melhores scores do singlePlayer mode
 *
 * @param msgGame - mensagem do resultado do jogo atual
 */
function showTopRankingSp(msgGame) {
    $(".gridGame").hide();

    let gameResult = document.createElement("div");
    gameResult.innerHTML = "<span> " + msgGame + " </span>";
    let tittleBox = document.createElement("div");
    tittleBox.innerHTML = "<span class='titleTypeOfRanking'> Ranking Top 10 SinglePlayer </span>";
    let rankingTop = document.createElement("table");
    rankingTop.setAttribute("class", "rankingTable");
    rankingTop.innerHTML += " <tr><th>Nome Jogador</th><th>Pontos</th><th>Tempo Jogo</th><th>Difficulty</th>   </tr> ";
    let rankingNumber = 0;


    rankings.SpRankings.forEach((ranking) => {
        if (ranking.gameType === jogo.difficulty) {
            rankingNumber++;
        }

    });



    if (!(rankingNumber == 0)) {
        for (let i = 0, j = 0; j < rankingNumber && j < 10; i++) {
            if (rankings.SpRankings[i].gameType === jogo.difficulty) {

                rankingTop.innerHTML += "<tr><td>" + rankings.SpRankings[i].nomePlayer + " </td>" +
                    "<td>" + rankings.SpRankings[i].points + "</td><td>" + rankings.SpRankings[i].timeGame + "</td>" +
                    "<td>" + rankings.SpRankings[i].gameType + "</td></tr>";
                j++;
            }
        }
    } else {
        rankingTop.innerHTML += "<tr><td colspan='4'>" + MSG_NO_SCORES_AVAILABLE + "</td></tr>";
    }

    let buttonRestartSp = document.createElement("button");
    buttonRestartSp.innerText = "Restart ";
    buttonRestartSp.addEventListener("click", () => {
        jogo.resetGameSp();
        $(".gridGame").show();
    });
    let buttonExitSp = document.createElement("button");
    buttonRestartSp.setAttribute("class", "buttonStyle");
    buttonExitSp.setAttribute("class", "buttonStyle");
    buttonExitSp.innerText = "Exit";
    buttonExitSp.addEventListener("click", () => {
        window.location.replace("index.html");
    });
    let buttonGroupSp = document.createElement("div");
    buttonGroupSp.setAttribute("class", "optionRanking");

    let divBoxSp = document.getElementById("rankingBox");
    divBoxSp.setAttribute("class", "rankingWindow");
    gameResult.setAttribute("class", "gameResult");

    divBoxSp.appendChild(gameResult);
    divBoxSp.appendChild(tittleBox);
    divBoxSp.appendChild(rankingTop);

    buttonGroupSp.appendChild(buttonRestartSp);
    buttonGroupSp.appendChild(buttonExitSp);
    divBoxSp.appendChild(buttonGroupSp);

}

/**Função que remove a lista de rankings da da pagina
 *
 */
function removeScore() {
    $("#rankingBox").empty();
    $("#rankingBox").removeClass("rankingWindow");


}

/**Função que mostra os top 10 melhores scores do Multiplayer mode
 *
 * @param msgGame - mensagem do resultado do jogo atual
 */
function showTopRankingMp(msgGame) {
    $(".gridGame").hide();
    let gameResult = document.createElement("div");
    gameResult.innerHTML = "<span> " + msgGame + " </span>";
    let tittleBox = document.createElement("div");
    tittleBox.innerHTML = "<span class='titleTypeOfRanking'> Ranking Top 10 Multiplayer </span>";
    let rankingTop = document.createElement("table");
    rankingTop.setAttribute("class", "rankingTable");
    rankingTop.innerHTML += " <tr><th>Winner</th><th>Loser</th><th>Pontos Winner</th> <th>Pontos Loser</th><th>Tempo de Jogo</th><th>Difficuldade</th>  </tr> ";
    let rankingNumber = 0;

    // verifica quantos jogos há na dificuldade currente
    rankings.MpRankings.forEach((ranking) => {
        if (ranking.gameType === jogo.difficulty) {
            rankingNumber++;
        }

    });

    let limit = 10;
    if (rankings.MpRankings.length <= 10) {
        limit = rankings.MpRankings.length;
    }
    if (!(rankingNumber == 0)) {

        for (let i = 0, j = 0; j < rankingNumber && j < 10; i++) {
            if (rankings.MpRankings[i].gameType == jogo.difficulty) {
                rankingTop.innerHTML += "<tr><td>" + rankings.MpRankings[i].winner + " </td>" +
                    "<td>" + rankings.MpRankings[i].loser + "</td><td>" + rankings.MpRankings[i].pointsWinner + "</td>" +
                    "<td>" + rankings.MpRankings[i].pointsLoser + "</td><td>" + rankings.MpRankings[i].timeGame + "</td><td>" +
                    rankings.MpRankings[i].gameType + "</td></tr>";

                j++;
            }
        }
    } else {
        rankingTop.innerHTML += "<tr><td colspan='6'>" + MSG_NO_SCORES_AVAILABLE + "</td></tr>";
    }
    let buttonRestart = document.createElement("button");
    buttonRestart.innerText = "Restart ";
    buttonRestart.addEventListener("click", () => {
        jogo.resetGameMp();
        $(".gridGame").show();
    });
    let buttonExit = document.createElement("button");
    buttonExit.innerText = "Exit";
    buttonExit.addEventListener("click", () => {
        window.location.replace("index.html");
    });
    let buttonBox = document.createElement("div");
    buttonBox.setAttribute("class", "buttonDiv")
    let buttonGroup = document.createElement("div");
    buttonGroup.setAttribute("class", "optionRanking");

    let divBox = document.getElementById("rankingBox");
    divBox.setAttribute("class", "rankingWindow");
    gameResult.setAttribute("class", "gameResult");

    buttonRestart.setAttribute("class", "buttonStyle");
    buttonExit.setAttribute("class", "buttonStyle");
    divBox.appendChild(gameResult);
    divBox.appendChild(tittleBox);
    divBox.appendChild(rankingTop);

    buttonGroup.appendChild(buttonRestart);
    buttonGroup.appendChild(buttonExit);
    divBox.appendChild(buttonGroup);


}




/**Função responsavel por iniciar o jogo rapido
 *
 */
function iniciarJogoRapido() {
    // coloca um evento no botão de ligar/desligar som
    document.getElementById("audio").addEventListener("click", () => {

        //caso a musica esteja on
        if (isMusicOn) {

            musicGame.pause();

            isMusicOn = false;
            $("#audio").attr("class", "soundOn");
        } else {
            //caso a musica esteja off
            musicGame.play();
            $("#audio").attr("class", "mute");
            isMusicOn = true;
        }
    });
    //começa a musica
    musicGame.play();
    musicGame.volume = 0.1;
    musicGame.loop = true;
    //coloca o jogo como visivel
    $(".gridGame").css("visibility", "visible");

    //obtem o nome do jogador
    jogo.name_player[0] = JSON.parse(sessionStorage.getItem("user"));
    jogo.difficulty = "EASY";
    //inicia o jogo
    init(9, 9, BOMBS_GAME_EASY);

}

/* ------------------------------------------------------------------------- */
/**Função responsavel por iniciar o jogo singleplayer e perguntar o nivel de dificuldade Singleplayer
 *
 */
function iniciarJogo() {
    // coloca um evento no botão de ligar/desligar som
    document.getElementById("audio").addEventListener("click", () => {

        //caso a musica esteja on
        if (isMusicOn) {

            musicGame.pause();

            isMusicOn = false;
            $("#audio").attr("class", "soundOn");
        } else {
            //caso a musica esteja off
            musicGame.play();
            $("#audio").attr("class", "mute");
            isMusicOn = true;
        }
    });

    musicGame.play();
    musicGame.volume = 0.1;
    musicGame.loop = true;
    var tamanho = $("input[type=radio][name=difficulty]:checked").val();
    if (tamanho != null) {
        $("#" + FORM_GAME_DIFFICULTY_SP).hide();
        $(".game").css("visibility", "visible");
        jogo.name_player[0] = JSON.parse(sessionStorage.getItem("user"));

        if (tamanho == 'dificuldadeEasy') {
            jogo.difficulty = "EASY";
            init(9, 9, BOMBS_GAME_EASY);
        } else if (tamanho == 'dificuldadeMedium') {
            jogo.difficulty = "MEDIUM";
            init(16, 16, BOMBS_GAME_MEDIUM);
        } else if (tamanho == 'dificuldadeHard') {
            jogo.difficulty = "HARD";
            init(16, 30, BOMBS_GAME_HARD);
        }
    }
}
/**Função responsavel por iniciar o jogo singleplayer e perguntar o nivel de dificuldade Multiplayer
 *
 */
function iniciarJogoMP() {
    // coloca um evento no botão de ligar/desligar som
    document.getElementById("audio").addEventListener("click", () => {

        if (isMusicOn) {

            musicGame.pause();

            isMusicOn = false;
            $("#audio").attr("class", "soundOn");
            $("#audio2").attr("class", "soundOn");
        } else {

            musicGame.play();
            $("#audio").attr("class", "mute");
            $("#audio2").attr("class", "mute");
            isMusicOn = true;
        }
    });
    // coloca um evento no botão de ligar/desligar som2
    document.getElementById("audio2").addEventListener("click", () => {

        if (isMusicOn) {

            musicGame.pause();

            isMusicOn = false;
            $("#audio").attr("class", "soundOn");
            $("#audio2").attr("class", "soundOn");
        } else {

            musicGame.play();
            $("#audio").attr("class", "mute");
            $("#audio2").attr("class", "mute");
            isMusicOn = true;
        }
    });
    //inicia a musica
    musicGame.play();
    musicGame.volume = 0.1;
    musicGame.loop = true;
    //obtem os valores do input radio
    var tamanho = $("input[type=radio][name=difficulty]:checked").val();
    var nomePlayer1 = JSON.parse(sessionStorage.getItem("user"));
    var nomePlayer2 = $("#nomePlayer2").val();
    var exists = existsPlayer(nomePlayer2);
    var sameUser = nomePlayer2 === nomePlayer1;

    if (tamanho != null && exists && !sameUser) {
        $("#" + FORMULARIO_MULTIPLAYER).hide();
        $(".game").css("visibility", "visible");

        //coloca as informações do jogador
        jogo.name_player[0] = nomePlayer1;
        jogo.name_player[1] = nomePlayer2;
        document.getElementById("player1").innerText = jogo.name_player[0];
        document.getElementById("player2").innerText = jogo.name_player[1];

        //inicia o jogo de acordo com o modo de dificuldade escolhida
        if (tamanho == 'dificuldadeEasy') {
            jogo.difficulty = "EASY";
            initMulti(9, 9, BOMBS_GAME_EASY);
        } else if (tamanho == 'dificuldadeMedium') {
            jogo.difficulty = "MEDIUM";
            initMulti(16, 16, BOMBS_GAME_MEDIUM);
        } else if (tamanho == 'dificuldadeHard') {
            jogo.difficulty = "HARD";
            initMulti(16, 30, BOMBS_GAME_HARD);
        }

    } else if (!(exists)) {
        $("#aviso").text("Utilizador não Existe!");

    } else if (sameUser) {
        $("#aviso").text("Utilizador Corrente, escolha outro! ");
    }

}

/**Função que verifica se um dado jogador existe
 *
 * @param user - nome de user
 * @returns {boolean} - se o utilizador existe
 */
function existsPlayer(user) {
    jogadores = JSON.parse(localStorage.getItem("jogadores")) || [];
    var exists = false;
    for (let j of jogadores) {
        if (user == j.nome) {
            exists = true;
        }
    }
    return exists;
}

/**Função que inicia a table e celulas de jogo do Modo Singular
 *
 * @param colunas - numero de colunas do jogo
 * @param linhas  - numero de Linhas do jogo
 * @param bombs  - quantidade de bombas
 */
function init(linhas, colunas, bombs) {
    initRankings();
    let table = new Table(linhas, colunas, bombs);
    jogo.table_player.push(table);
    jogo.row = Number(linhas);
    jogo.col = Number(colunas);
    jogo.bombs = Number(bombs);


    let localJogo = document.getElementById(ID_TABLE_SINGLEPLAYER);

    // criar table
    let tabela = document.createElement('table');
    tabela.setAttribute('class', 'gameTable');
    tabela.setAttribute('alt', 'Janela do Jogo');

    // faz cada linha
    for (let i = 1; i <= linhas; i++) {
        let linha = document.createElement('tr');
        linha.setAttribute('class', 'gameRow');

        //Criar Celulas do jogo
        for (let j = 1; j <= colunas; j++) {
            let celula = document.createElement('td');
            let row = String(i);
            let col = String(j);
            let id = row + "," + col;
            celula.setAttribute('class', 'celula');
            celula.setAttribute('id', id);
            celula.setAttribute('alt', 'Celula nº ' + "(" + id + ")");
            celula.setAttribute('aria-label', 'Celula nº ' + "(" + id + ")");
            celula.setAttribute('tabindex', String(col + row));
            celula.addEventListener("mouseup", clicado, false);


            jogo.table_player[0].cells[i][j].buttonTd = celula;
            linha.appendChild(celula);

        }


        tabela.appendChild(linha);
    }

    localJogo.appendChild(tabela);

    // Marca o inicio do tempo de jogo
    jogo.inicio = Math.floor(Date.now() / 1000);

    // Chama mostraTempoJogo() a cada segundo
    temporizadorTempoJogo = setInterval(mostraTempoJogo, 1000);
    //coloca temporizador no update de pontos e outras informações do jogo
    verificacaoPontos = setInterval(updatePointsSP, 1000);

    //coloca evento nos butões de reset com o smilley
    document.getElementById(BTN_ID_RESET_GAME_SP).addEventListener("mouseup", jogo.resetGameSp, false);


}



/**Função que inicia as tables e celulas de jogo do Modo Singular
 *
 * @param colunas - numero de colunas do jogo
 * @param linhas  - numero de Linhas do jogo
 * @param bombs  - quantidade de bombas
 *
 */
function initMulti(linhas, colunas, bombs) {
    initRankings();
    $(".gridGame").css("visibility", "visible");
    jogo.table_player.push(new Table(linhas, colunas, bombs));
    jogo.table_player.push(new Table(linhas, colunas, bombs));

    console.log("criou table");

    var localJogo = document.getElementById(ID_TABLE_MULTIPLAYER_P1);
    var localJogo2 = document.getElementById(ID_TABLE_MULTIPLAYER_P2);

    let tabela = document.createElement('table');
    tabela.setAttribute("id", "P1");
    tabela.setAttribute('class', 'gameTable');
    tabela.setAttribute('alt', 'Jogador 1');

    // faz cada linha
    for (let i = 1; i <= linhas; i++) {
        let linha = document.createElement('tr');
        linha.setAttribute('class', 'gameRow');
        //faz cada celula
        for (let j = 1; j <= colunas; j++) {
            var celulaMp1 = document.createElement('td');
            let row = String(i);
            let col = String(j);
            let id = "P1," + row + "," + col;
            celulaMp1.setAttribute('class', 'celula');
            celulaMp1.setAttribute('id', id);
            celulaMp1.setAttribute('alt', 'Player 1 Celula nº ' + "(" + id + ")");
            celulaMp1.addEventListener("mouseup", clicado, false);
            // por o elemento da celula diretamente na abstração da celula
            jogo.table_player[0].cells[i][j].setTdElement(celulaMp1);

            linha.appendChild(celulaMp1);

        }

        tabela.appendChild(linha);
    }

    localJogo.appendChild(tabela);

    var tabela2 = document.createElement('table');
    tabela2.setAttribute("id", "P2");
    tabela2.setAttribute('class', 'gameTable');
    tabela2.setAttribute('alt', 'Jogador 2');

    // faz cada linha
    for (let i = 1; i <= linhas; i++) {
        var linha2 = document.createElement('tr');
        linha2.setAttribute('class', 'gameRow');
        linha2.setAttribute('alt', 'Linha ' + i);
        //faz cada celula
        for (let j = 1; j <= colunas; j++) {
            var celulaMp2 = document.createElement('td');
            let row = String(i);
            let col = String(j);
            let id = "P2," + row + "," + col;
            celulaMp2.setAttribute('class', 'celula');
            celulaMp2.setAttribute('id', id);
            celulaMp2.setAttribute('alt', 'Player 2 Celula nº ' + "(" + id + ")");
            celulaMp2.addEventListener("mouseup", clicado, false);
            jogo.table_player[1].cells[i][j].setTdElement(celulaMp2);

            linha2.appendChild(celulaMp2);

        }

        tabela2.appendChild(linha2);
    }
    localJogo2.appendChild(tabela2);
    jogo.inicio = Math.floor(Date.now() / 1000);

    // Chama mostraTempoJogo() a cada segundo

    temporizadorTempoJogo = setInterval(() => {
        mostraTempoJogo();
        mostraTempoJogoP2();
    }, 1000);

    // coloca temporizador para atualizar os pontos e outros dados de multiplayer
    verificacaoPontos = setInterval(updatePointsMP, 1000);

    //coloca evento nos butões de reset com o smilley
    document.getElementById(BTN_ID_RESET_GAME_MP_P1).addEventListener("mouseup", jogo.resetGameMp, false);
    document.getElementById(BTN_ID_RESET_GAME_MP_P2).addEventListener("mouseup", jogo.resetGameMp, false);
}

/**Função que lida com as acções do jogador no jogo e que por sua vez de acordo com a intenção manifestada pelo utilizador
 * encaminha para o tabuleiro e acção correspondente
 *
 * @param e - evento do elemento clickado
 */
function clicado(e) {

    // manda abrir o opencell e espera retorno, dependendo do retorno ira fazer uma acção no jogo
    let t = e.target;

    let id = t.id.split(",");
    if (id[0] == "P1" || id[0] == "P2") {
        clicadoMp(id, e);
    } else {
        clicadoSp(id, e);
    }

}
/**Função responsavel pelo o evento que ocorre quando uma celula do jogo é premida
 *
 * @param e
 */
function clicadoSp(id, e) {


    // manda abrir o opencell e espera retorno, dependendo do retorno ira fazer uma acção no jogo

    let row = id[0];
    let col = id[1];

    // se for a tecla direita do rato
    if (e.button == 0) {

        jogo.table_player[0].open(row, col);
        // se for a tecla do meio do rato
    } else if (e.button == 1) {

        jogo.table_player[0].placeQuestion(row, col);
        // se for a tecla esquerda do rato
    } else if (e.button == 2) {
        jogo.table_player[0].placeFlag(row, col);
    }
    //evitar propagação e comportamento normal do evento
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();


}

/**Função responsavel pelo o evento que ocorre quando uma celula do jogo é premida
 *
 * @param e
 */
function clicadoMp(id, e) {
    var currentPlayer = jogo.table_player[jogo.turn];
    let turn = "P" + Number(jogo.turn + 1);
    // manda abrir o opencell e espera retorno, dependendo do retorno ira fazer uma acção no jogo

    // se o id do jogado é o certo
    if (id[0] == turn) {
        console.log("Jogou o jogador " + turn);
        let row = id[1];
        let col = id[2];

        // se for a tecla direita do rato
        if (e.button == 0) {

            currentPlayer.open(row, col);
            // se for a tecla do meio do rato
        } else if (e.button == 1) {


            currentPlayer.placeQuestion(row, col);

            // se for a tecla esquerda do rato
        } else if (e.button == 2) {
            currentPlayer.placeFlag(row, col);
        }
        //evitar propagação e comportamento normal do evento
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        // passa para o turno seguinte
        jogo.nextTurn();
        //muda o texto informativo do jogador atual
        document.getElementById(ID_SPAN_PLAYER_TURN).innerText = "P" + Number(jogo.turn + 1);
        document.getElementById(ID_SPAN_PLAYER2_TURN).innerText = "P" + Number(jogo.turn + 1);
    } else {
        // caso seja o jogador errado usa o shake from jquery UI para abanar o seu jogo , avisando o do erro
        let actualPlayer = id[0].slice(1);
        $("#player" + actualPlayer + "Table").effect("shake");


        //caso tenha sido o jogador errado dispoe de aviso no console log
        console.log("Jogador errado, espere a sua vez, agora é a vez do jogador " + Number(jogo.turn + 1) + " " + jogo.name_player[jogo.turn]);

    }

}


/** Mostra o tempo do jogo
 *
 * Função chamada pelo setinterval que atualiza o contador de tempo do jogo no sitio pretendido
 *
 */
function mostraTempoJogo() {
    document.getElementById(ID_SPAN_TEMPO_JOGO).innerHTML = zeroPad(Math.floor((Date.now() / 1000) - jogo.inicio), 3);
}

function mostraTempoJogoP2() {
    document.getElementById(ID_SPAN_TEMPO_JOGOP2).innerHTML = zeroPad(Math.floor((Date.now() / 1000) - jogo.inicio), 3);
}
/**Função que verifica se o jogo currente acabaou e caso isto se verifique remove e blooqueia o jogo até ser reniciado
 *
 */
function finishGame() {

    // se o Jogo acabou



    // Parar todos os timmers

    clearInterval(temporizadorTempoJogo);
    clearInterval(verificacaoPontos);
    let time_played = Math.floor((Date.now() / 1000) - jogo.inicio);
    let celulas = document.getElementsByClassName("celula");
    for (let i = 0; i < celulas.length; i++) {
        celulas[i].removeEventListener("mouseup", clicado);
    }

    //se foi um jogo ganho

    if (jogo.won) {

        // se o segundo jogador não está definido sabemos ser um singlePlayer game
        if (jogo.table_player[1] === undefined) {

            setRankingSP(jogo.name_player[0], jogo.table_player[0].points, time_played, jogo.difficulty);
            jogo.addTimeWonP1();
            window.setTimeout(() => {
                showTopRankingSp(jogo.name_player[0] + " " + MSG_WIN_SP);
            }, 2000);


            //caso contrario sabemos que é um multiplayer game
        } else {
            let winner;
            let loser;
            let pointsWinner;
            let pointsLoser;
            if (jogo.table_player[0].won) {
                jogo.addTimeWonP1();
                winner = jogo.name_player[0];
                loser = jogo.name_player[1];
                pointsWinner = jogo.table_player[0].getPoints();
                pointsLoser = jogo.table_player[1].getPoints();
                setRankingMP(winner, loser, pointsWinner, pointsLoser, time_played, jogo.difficulty);
                console.log("ganhou jogador 1");
                window.setTimeout(() => {
                    showTopRankingMp(winner + " " + MSG_WIN_MP + " " + loser);
                }, 2000);
            } else {
                jogo.addTimeWonP2();
                winner = jogo.name_player[1];
                loser = jogo.name_player[0];
                pointsWinner = jogo.table_player[1].getPoints();
                pointsLoser = jogo.table_player[0].getPoints();
                setRankingMP(winner, loser, pointsWinner, pointsLoser, time_played, jogo.difficulty);
                window.setTimeout(() => {
                    showTopRankingMp(winner + " " + MSG_WIN_MP + " " + loser);
                }, 2000);
            }


        }

        // se foi um jogo perdido colocar no lost games do localstorage e mostrar o ranking
    } else {
        if (jogo.table_player[1] === undefined) {

            setLostGame(jogo.name_player[0], time_played);
            window.setTimeout(() => {
                showTopRankingSp(jogo.name_player[0] + " " + MSG_LOSE_SP);
            }, 2000);
        } else {

            if (jogo.table_player[0].lost) {
                setLostGame(jogo.name_player[0], time_played);
                window.setTimeout(() => {
                    showTopRankingMp(jogo.name_player[0] + " " + MSG_LOSE_MP);
                }, 2000);

            } else {
                setLostGame(jogo.name_player[1], time_played);
                window.setTimeout(() => {
                    showTopRankingMp(jogo.name_player[1] + " " + MSG_LOSE_MP);
                }, 2000);
            }
        }



    }


}

/**Função que atualiza os pontos do modo singlePlayer e coloca-os nas zonas designadas
 *  //TO DO  colocar todos os getElementById já em uma var correspondente
 */
function updatePointsSP() {
    let pointElement = document.getElementById(ID_POINTS_SINGLEPLAYER);
    pointElement.innerText = zeroPad(jogo.table_player[0].getPoints(), 3);

    let bombsRemained = document.getElementById(ID_BOMBS_REMAINED);
    bombsRemained.innerText = zeroPad(jogo.table_player[0].getBombsRemained(), 3);

}

/**Função que atualiza os pontos do modo Multiplayer e coloca-os nas zonas designadas
 *  //TO DO  colocar todos os getElementById já em uma var correspondente
 */
function updatePointsMP() {
    let pointElementP1 = document.getElementById(ID_POINTS_MULTIPLAYER_P1)
    let pointElementP2 = document.getElementById(ID_POINTS_MULTIPLAYER_P2)

    pointElementP1.innerText = zeroPad(jogo.table_player[0].getPoints(), 3);
    pointElementP2.innerText = zeroPad(jogo.table_player[1].getPoints(), 3);
    let bombsRemainedP1 = document.getElementById(ID_BOMBS_REMAINED_P1);
    bombsRemainedP1.innerText = zeroPad(jogo.table_player[0].getBombsRemained(), 3);
    let bombsRemainedP2 = document.getElementById(ID_BOMBS_REMAINED_P2);
    bombsRemainedP2.innerText = zeroPad(jogo.table_player[1].getBombsRemained(), 3);
}

/**Classe que representa cada tabuleiro de jogo , usada no modo singular e no modo multiplaye.
 *
 */
class Table {

    cells;
    cellNumbers;
    openedCells;
    col;
    row;
    difficulty;
    bombs;
    placedFlags;
    points;
    lost;
    won;


    /**Construtor da classe Table , que inicia todas as celulas e estados corrrespondentes do jogo
     *
     * @param row - numero de linhas
     * @param col - numero de colunas
     */
    constructor(row, col, bombs) {
        //acerto pois não usammos a fila ou coluna 0
        this.cellNumbers = row * col;
        this.openedCells = 0;
        this.col = col;
        this.row = row;
        this.points = 0;
        this.bombs = bombs;
        this.placedFlags = 0;
        this.lost = false;
        this.won = false;
        this.scrambled = false;
        this.cells = new Array(this.row);
        // inicia cada linha
        for (let i = 1; i <= this.row; i++) {
            this.cells[i] = new Array(this.col);
            // ciclo para iniciar cada celula dessa linha
            for (let j = 1; j <= this.col; j++) {
                this.cells[i][j] = new Cell(i, j);
            }
        }
        //ciclo para definir dentro de cada celula a sua adjacente
        for (let i = 1; i <= this.row; i++) {
            for (let j = 1; j <= this.col; j++) {
                this.setAdjCell(i, j);
            }

        }
        this.scrambled = false;


    }

    /**Método getter que retorna a pontuação atual
     *
     * @returns {Number} pontuação atual
     */
    getPoints() {
        return this.points;
    }

    /**Método que distribui de forma random as bombas nas celulas do jogo excluindo a primeira célula selecionada
     *
     * @param firsOpenedRow - linha da primeira celula aberta
     * @param firsOpenedCol - coluna da primeira celula aberta
     *
     */
    scrambleBombs(firsOpenedRow, firsOpenedCol) {
        let bombsToPlace = this.bombs;
        while (bombsToPlace != 0) {
            let colRandom = Math.floor(Math.random() * (this.col - 1)) + 1;
            let rowRandom = Math.floor(Math.random() * (this.row - 1)) + 1;
            if (colRandom == firsOpenedCol && rowRandom == firsOpenedRow) continue;
            console.log(colRandom);
            console.log(rowRandom);
            console.log(this.col);
            console.log(this.row);
            console.log(bombsToPlace)
            if (!this.cells[rowRandom][colRandom].hasBomb()) {
                this.cells[rowRandom][colRandom].setBomb();
                bombsToPlace--;
            }
        }
        this.scrambled = true;
    }
    placeQuestion(row, col) {
        question.play();
        if (!this.cells[row][col].hasFlag() && !this.cells[row][col].isQuestioned()) {
            this.cells[row][col].placeQuestion();

        } else if (!this.cells[row][col].hasFlag() && this.cells[row][col].isQuestioned()) {
            this.cells[row][col].removeQuestion();
        }
    }

    /**Função responsavel por gerir a colocação e remoção de flags
     *
     * @param row
     * @param col
     */
    placeFlag(row, col) {
        placingFlag.play();
        if (!this.cells[row][col].hasFlag() && !this.cells[row][col].isOpened() && !this.cells[row][col].isQuestioned()) {
            this.cells[row][col].placeFlag();
            this.placedFlags++;


        } else if (this.cells[row][col].hasFlag()) {
            this.cells[row][col].removeFlag();
            this.placedFlags--;

        }
        this.checkIfFinished();
    }


    /**Método que responsavel pela lógica associada à abertura de celulas
     *
     * @param row -linha da célula
     * @param col - coluna da célula
     */
    open(row, col) {
        let AdjCells = [];
        if (this.scrambled && !this.cells[row][col].hasFlag() && !this.cells[row][col].isQuestioned()) {
            // numero de bombas adjacentes iniciado

            // caso esta celula tenha bomba ela explode
            if (this.cells[row][col].hasBomb()) {
                cellExplodedSound.play();
                this.cells[row][col].explode();
                window.setTimeout(() => {
                    this.explodeAll()
                }, 500);
                this.explodeAll();
                //é posto como verdadeiro o estado jogoCurrente finished
                this.lost = true;
                jogo.finished = true;
                jogo.lost = true;
                finishGame();
                // caso contrario se não estiver aberto
            } else if (!this.cells[row][col].isOpened()) {
                // abrir celula
                this.openCell(row, col);

                AdjCells = this.cells[row][col].getAdj();
                this.processAdjacentCells(AdjCells, row, col);
                // se array contiver adjacencias

            }
        } else if (!this.cells[row][col].hasFlag() && !this.cells[row][col].isQuestioned()) {
            // Em caso de ser a primeira jogada, abre a celula e depois invoca a função para distribuir as bombas
            this.openCell(row, col);
            this.scrambleBombs(row, col);
            AdjCells = this.cells[row][col].getAdj();
            // invoca a função para processar as adjacentes
            this.processAdjacentCells(AdjCells, row, col);

        }

    }

    /**
     *
     * @param AdjCells
     * @param row
     * @param col
     */
    processAdjacentCells(AdjCells, row, col) {
        let numBombs = this.countAdjBombs(AdjCells);
        AdjCells.filter(cell => cell !== this.cells[row][col].id);
        if (numBombs == 0) {
            this.openAdjCells(AdjCells);
        } else {
            this.cells[row][col].placeNumber(numBombs);
        }
    }

    /**
     *
     * @param AdjCells
     */
    openAdjCells(AdjCells) {


        if (AdjCells.length > 0) {

            // fazer um loop nas adjacencias
            for (let i = 0; i < AdjCells.length; i++) {
                // obter o id
                let id = AdjCells[i].split(",");
                //obter linha e coluna do id
                let rowAdj = id[0];
                let colAdj = id[1];
                //caso os mesmos não tenham bomba e não estejam abertos e não tenham flag ou questão
                if (!this.cells[rowAdj][colAdj].isOpen && !this.cells[rowAdj][colAdj].hasBomb() &&
                    !this.cells[rowAdj][colAdj].hasFlag() && !this.cells[rowAdj][colAdj].isQuestioned()) {
                    let newAdjCell = [];
                    //obter os adjacentes
                    newAdjCell = this.cells[rowAdj][colAdj].getAdj();
                    //filtrar os adjacentes removendo a celula corrente para evitar abrir repetidos
                    newAdjCell.filter(cell => cell !== AdjCells[i])
                    //contar as bombas que existem nos adjacentes
                    let numBombs = this.countAdjBombs(newAdjCell);
                    //abrir a celula
                    this.openCell(rowAdj, colAdj);
                    // se o numero de bombas for diferente de zero colocar o numero de bombas adjacentes
                    // e não abrir mais adjacentes
                    if (numBombs != 0) {
                        this.cells[rowAdj][colAdj].placeNumber(numBombs);

                    } else {
                        //caso contrario abrir os adjacentes recursivamente
                        this.openAdjCells(newAdjCell);

                    }
                }


            }


        } else {
            // caso base, retornar se não existirem adjacentes
            return;
        }


    }

    /**Função que explode todas as bombas
     *
     */
    explodeAll() {
        //iterar por todas as celulas e as que tiverem bomba são explodidas
        for (let i = 1; i <= this.row; i++) {
            // ciclo para iniciar cada celula dessa linha
            for (let j = 1; j <= this.col; j++) {
                if (this.cells[i][j].hasBomb() && !this.cells[i][j].isOpen) {
                    this.cells[i][j].explode();

                }
            }
        }
    }

    /**Função que abre a celula e faz update do estado do jogo
     *
     * @param row - numero da Linha
     * @param col - numero da Coluna
     * @requires !this.cells[row][col].isOpened() &&  !this.cells[row][col].hasBomb()
     */
    openCell(row, col) {
        openedCellSound.play();
        this.cells[row][col].openCell();
        this.points += POINTS_GIVEN_OPENED_CELL;
        this.openedCells++;
        this.checkIfFinished();


    }

    /**Função que verifica quantas bombas existem nas celulas adjacentes
     *
     * @param Adj - array que contem os ids das celulas adjacentes
     * @returns {number} numero de celulas adjacentes
     */
    countAdjBombs(Adj) {
        let numBomb = 0;
        for (let i = 0; i < Adj.length; i++) {
            let id = Adj[i].split(",");
            //obter linha e coluna do id
            let rowAdj = id[0];
            let colAdj = id[1];
            if (this.cells[rowAdj][colAdj].hasBomb()) {
                numBomb++
            }
        }
        return numBomb;
    }

    /**Método que obtem as celulas adjacentes a uma certa celula adicionando oss id´s deste à celula correspondente
     *
     * @param currentRow - numero da linha da celula atual
     * @param currentCol - numero da coluna da celula atual
     */
    setAdjCell(currentRow, currentCol) {
        // caso as celulas ja tiverem sido criadas
        if (this.cells != undefined) {
            // criar array para adjacentes
            let AdjCells = [];
            // guardar a referencia textual da celula currente
            let thisCell = currentRow + ',' + currentCol;
            // faz um loop duplo em que percorre das unidaddes coluna menos um até coluna mais um e linha menos um até coluna mais um
            // desta forma passa por todas as adjacentees e para não adicionar celulas que não existem
            // é adicionada uma condição em que a linha tem de ser 1<x<n e colunas tem de ser 1<x<n

            for (let i = currentRow - 1; i <= currentRow + 1; i++) {
                for (let j = currentCol - 1; j <= currentCol + 1; j++) {
                    if ((i >= 1 && i <= this.row) && (j >= 1 && j <= this.col)) {
                        // adiciona a referencia textual da celula adjacente a array
                        AdjCells.push(Number(i) + "," + j);
                    }
                }
            }
            // filtra a celula corrente removendo a da lista
            AdjCells = AdjCells.filter(cell => cell !== thisCell);
            //coloca a array na celula , desta maneira cada celula vai ter a sua lista de adjacentes
            this.cells[currentRow][currentCol].setAjacentCells(AdjCells);
        }
    }

    /**Método que obtem o numero de bombas que faltam assinalar
     *
     * @returns {number} - numero de bombas não assinaladas
     */
    getBombsRemained() {
        return Number(this.bombs - this.placedFlags);
    }

    /**Método que verifica se o utilizador ganhou o jogo verificando o estado do jogo e se o numero de celulas por
     * abrir é igual a 0, contando as celulas com flag como celulas a menos
     *
     */
    checkIfFinished() {
        // condições para ganhar
        // não existir mais nenhuma celula por abrir
        // estarem exatamente tantas bandeiras quanto o numero de bombas existentes

        var allBombsFlagged = (this.placedFlags == this.bombs);
        let cellsToGo = (this.cellNumbers - (this.openedCells + this.placedFlags));
        if ((cellsToGo == 0) && allBombsFlagged) {
            jogo.finished = true;
            jogo.won = true;
            this.won = true;
            wonGameSound.play();
        }
        if (jogo.finished) {
            finishGame();
        }


    }

    /**Método que renicia a tabela colocando todos os estados em estado inicial e fazendo reset do estado de cada
     * celula desta table de jogo
     *
     */
    resetTable() {
        this.scrambled = false;
        this.won = false;
        this.placedFlags = 0;
        this.openedCells = 0;
        this.lost = false;
        this.points = 0;
        // itera todas as celulas e faz reset das mesmas
        for (let i = 1; i <= this.row; i++) {
            for (let j = 1; j <= this.col; j++) {
                this.cells[i][j].resetCell();
            }

        }
    }



}


/**Classe que representa uma celula do jogo
 *
 */
class Cell {
    adjCells;
    col;
    row;
    isFlagged;
    isBombed;
    isOpen;
    buttonTd;
    suspect;


    /**Construtor de Celula do jogo
     *
     * @param row - recebe a linha do jogo
     * @param col - recebe a coluna do jogo
     */
    constructor(row, col) {
        this.row = Number(row);
        this.col = Number(col);
        this.buttonTd = null;
        this.isBombed = false;
        this.isFlagged = false;
        this.adjCells = [];
        this.suspect = false;


    }

    /**Método setter que coloca a referencia do elemento html referente a esta celula para manipulação  direta
     * da celula a partir desta abstração de celula de jogo
     *
     * @param cellButton elemento html referente a esta celula no jooo
     */
    setTdElement(cellButton) {
        this.buttonTd = cellButton;
    }

    /** Método que abre a celula e consoante o estado da celula explode ou abre, mudando o visual da mesma no jogo
     *
     */
    openCell() {
        if (this.isBombed) {
            this.explode();
            jogo.finished = true;
            jogo.lost = true;
            this.buttonTd.removeEventListener("mouseup", clicado);
        } else {

            console.log("Aberta Celula [" + this.row + "," + this.col + "]");

            this.buttonTd.setAttribute('class', 'openedCell');
            this.buttonTd.removeEventListener("mouseup", clicado);
            this.isOpen = true;

        }
    }

    /**Método que verifica se esta celula têm uma bomba
     *
     * @returns {boolean} se a celula tem bomba
     */
    hasBomb() {
        return this.isBombed;
    }

    /**Método setter que coloca esta celula como portadora de bomba
     *
     */
    setBomb() {
        this.isBombed = true;
    }

    /**Obtem lista de celulas adjacentes a esta celula
     *
     * @returns {Array} array de id´s de celulas adjacentes
     */
    getAdj() {
        let Adjacent = this.adjCells;
        return Adjacent;

    }

    /**M etodo que coloca a flag mudando o estado da celula e coloca as classes css associadas a celula com flag
     *
     */
    placeFlag() {
        if (!this.isOpen) {
            this.isFlagged = true;
            this.buttonTd.setAttribute('class', 'celula flagCell');
        };
    }
    /**Metodo que remove a flag mudando o estado da celula e coloca as classes css associadas a celula normal
     *
     */
    removeFlag() {
        if (this.isFlagged) {

            this.isFlagged = false;
            this.buttonTd.removeAttribute('class', 'flagCell')
            this.buttonTd.setAttribute('class', 'celula ');
        }
    }

    /**Método que verifica se a celula currente contem uma flag e
     *
     * @returns {flagged} booleano que representa se a celula tem flag
     */
    hasFlag() {
        let flagged = this.isFlagged;
        return flagged;
    }


    /**Metodo getter para o estado da celula em relação a estar aberta ou não
     *
     * @returns {opened} booleano que representa se a celula está aberta
     */
    isOpened() {
        let opened = this.isOpen;
        return opened;
    }

    /**Método responsavel por colocar o numero de bombas e a classe associada caso o numero de bombas seja maior que 0
     *
     * @param numberBomb
     */
    placeNumber(numberBomb) {
        if (numberBomb > 0) {

            this.buttonTd.setAttribute('class', 'openedCell numberBombs adj_Bombs_' + numberBomb);
            this.buttonTd.innerText = numberBomb;
        }
    }

    /**Método responsavel por mudar a classe da celula associada para estado aberto e de bomba explodida
     *
     */
    explode() {

        this.buttonTd.setAttribute('class', 'openedCell bombCell');
        this.buttonTd.removeEventListener("mouseup", clicado);
        this.isOpen = true;
    }

    /**Método setter que guarda as celulas adjacentes a esta celula
     *
     * @param AdjCells - array de id´s de celulas adjacentes
     */
    setAjacentCells(AdjCells) {
        this.adjCells = AdjCells;

    }

    isQuestioned() {
        return this.suspect;
    }

    placeQuestion() {
        this.buttonTd.setAttribute('class', 'celula interrogation');

        this.suspect = true;

    }

    removeQuestion() {
        this.buttonTd.removeAttribute('class', ' interrogation');
        this.buttonTd.setAttribute('class', 'celula ');

        this.suspect = false;
    }

    /**Método que faz reinicia os estados desta célula
     *
     */
    resetCell() {

        this.buttonTd.removeAttribute('class', 'flagCell')
        this.buttonTd.setAttribute('class', 'celula ');
        this.isFlagged = false;
        this.isOpen = false;
        this.isBombed = false;
        this.buttonTd.removeAttribute('class', 'openedCell')
        this.buttonTd.removeAttribute('class', 'bombCell')
        this.buttonTd.removeAttribute('class', 'numberBombs')

        this.buttonTd.addEventListener("mouseup", clicado, false);
        this.buttonTd.setAttribute('class', 'celula ');
        this.buttonTd.innerText = "";
    }



}

/**Código que impossibilita que quando clickemos com o botão direito apareça o menu de opções,
 * Util para conseguirmos meter bandeiras nas celulas
 *
 * @type {string}
 */
var message = "";

function clickIE() {
    if (document.all) {
        (message);
        return false;
    }
}

function clickNS(e) {
    if (document.layers || (document.getElementById && !document.all)) {
        if (e.which == 2 || e.which == 3) {
            (message);
            return false;
        }
    }
}
if (document.layers) {
    document.captureEvents(Event.MOUSEDOWN);
    document.onmousedown = clickNS;
} else {
    document.onmouseup = clickNS;
    document.oncontextmenu = clickIE;
}
document.oncontextmenu = new Function("return false")