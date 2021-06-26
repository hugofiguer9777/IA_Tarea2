const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

var og_board = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

var heuristic_board = [
  [120, -20, 20, 5, 5, 20, -20, 120],
  [-20, -40, -5, -5, -5, -5, -40, -20],
  [20, -5, 15, 3, 3, 15, -5, 20],
  [5, -5, 3, 3, 3, 3, -5, 5],
  [5, -5, 3, 3, 3, 3, -5, 5],
  [20, -5, 15, 3, 3, 15, -5, 20],
  [-20, -40, -5, -5, -5, -5, -40, -20],
  [120, -20, 20, 5, 5, 20, -20, 120],
];

var moves = [];
var enemy_moves = [];

// ./ngrok http 3000
// http://luisespino.com/temp/games/reversi/index.php

function sort_and_clean_moves() {
  let aux = new Set();
  for (let item of moves) {
    aux.add(item.spot);
  }
  moves = [];
  for (let item of aux) {
    moves.push({
      spot: item,
      h: heuristic_board[parseInt(item.split("")[0])][
        parseInt(item.split("")[1])
      ],
    });
  }
  moves.sort((a, b) => {
    if (a.h > b.h) return -1;
    else return 1;
  });
}

function copy_array() {
  let array = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ];

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      array[i][j] = og_board[i][j];
    }
  }

  return array;
}

function find_enemy_moves() {
  if (enemy_moves.length == 0) return 0;

  let aux = new Set();
  for (let item of enemy_moves) {
    aux.add(item.spot);
  }
  enemy_moves = [];
  for (let item of aux) {
    enemy_moves.push({
      spot: item,
      h: heuristic_board[parseInt(item.split("")[0])][
        parseInt(item.split("")[1])
      ],
    });
  }
  enemy_moves.sort((a, b) => {
    if (a.h > b.h) return -1;
    else return 1;
  });
  return enemy_moves[0].h;
}

function minimax(turn) {
  enemy_moves = [];

  var enemy = turn == "1" ? "0" : "1";
  let map;
  let x, y, pos, h;
  moves = moves.slice(0, 4);
  for (let i = 0; i < moves.length; i++) {
    enemy_moves = [];
    map = copy_array();
    pos = moves[i].spot;
    y = parseInt(pos.split("")[0]);
    x = parseInt(pos.split("")[1]);
    map[y][x] = turn;
    enemy_moves = [];
    find_enemy_spots(enemy, map);
    h = find_enemy_moves();
    moves[i].h = moves[i].h - h;
  }

  moves.sort((a, b) => {
    if (a.h > b.h) return -1;
    else return 1;
  });
  console.table(moves);
}

function find_move(move, rival, x, y, board) {
  var x2 = 0,
    y2 = 0;
  let turno = rival == "1" ? "0" : "1";
  if (move == 0) {
    x2 = x;
    for (y2 = y - 1; y2 > 0; y2--) {
      x2--;
      if (board[y2][x2] == rival && board[y2 - 1][x2 - 1] == "2") {
        return y2 - 1 + "" + (x2 - 1);
      } else if (board[y2][x2] == rival && board[y2 - 1][x2 - 1] == turno)
        return '99'
    }
  } else if (move == 1) {
    x2 = x;
    for (y2 = y - 1; y2 > 0; y2--) {
      if (board[y2][x2] == rival && board[y2 - 1][x2] == "2") {
        return y2 - 1 + "" + x2;
      } else if (board[y2][x2] == rival && board[y2 - 1][x2] == turno)
        return '99'
    }
  } else if (move == 2) {
    x2 = x;
    for (y2 = y - 1; y2 > 0; y2--) {
      x2++;
      if (board[y2][x2] == rival && board[y2 - 1][x2 + 1] == "2") {
        return y2 - 1 + "" + (x2 + 1);
      } else if (board[y2][x2] == rival && board[y2 - 1][x2 + 1] == turno)
        return '99'
    }
  } else if (move == 3) {
    y2 = y;
    for (x2 = x + 1; x2 < 7; x2++) {
      if (board[y2][x2] == rival && board[y2][x2 + 1] == "2") {
        return y2 + "" + (x2 + 1);
      } else if (board[y2][x2] == rival && board[y2][x2 + 1] == turno)
        return '99'
    }
  } else if (move == 4) {
    x2 = x;
    for (y2 = y + 1; y2 < 7; y2++) {
      x2++;
      if (board[y2][x2] == rival && board[y2 + 1][x2 + 1] == "2") {
        return y2 + 1 + "" + (x2 + 1);
      } else if (board[y2][x2] == rival && board[y2 + 1][x2 + 1] == turno)
        return '99';
    }
  } else if (move == 5) {
    x2 = x;
    for (y2 = y + 1; y2 < 7; y2++) {
      if (board[y2][x2] == rival && board[y2 + 1][x2] == "2") {
        return y2 + 1 + "" + x2;
      } else if (board[y2][x2] == rival && board[y2 + 1][x2] == turno)
        return "99";
    }
  } else if (move == 6) {
    x2 = x;
    for (y2 = y + 1; y2 < 7; y2++) {
      x2--;
      if (board[y2][x2] == rival && board[y2 + 1][x2 - 1] == "2") {
        return y2 + 1 + "" + (x2 - 1);
      } else if (board[y2][x2] == rival && board[y2 + 1][x2 - 1] == turno)
        return "99";
    }
  } else if (move == 7) {
    y2 = y;
    for (x2 = x - 1; x2 > 0; x2--) {
      if (board[y2][x2] == rival && board[y2][x2 - 1] == "2") {
        return y2 + "" + (x2 - 1);
      } else if (board[y2][x2] == rival && board[y2][x2 - 1] == turno)
        return "99";

    }
  }
  return "99";
}

function find_spots(turn) {
  let rival = turn == "1" ? "0" : "1";
  let spot;
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (og_board[y][x] == turn) {
        if (y - 1 > 0 && x - 1 > 0 && og_board[y - 1][x - 1] == rival) {
          // Arriba a la izq
          spot = find_move(0, rival, x, y, og_board);
          if (spot != "99")
            moves.push({
              spot: spot,
              h: heuristic_board[parseInt(spot.split("")[0])][
                parseInt(spot.split("")[1])
              ],
            });
        }
        if (y - 1 > 0 && og_board[y - 1][x] == rival) {
          // Arriba
          spot = find_move(1, rival, x, y, og_board);
          if (spot != "99")
            moves.push({
              spot: spot,
              h: heuristic_board[parseInt(spot.split("")[0])][
                parseInt(spot.split("")[1])
              ],
            });
        }
        if (y - 1 > 0 && x + 1 < 7 && og_board[y - 1][x + 1] == rival) {
          // Arriba Derecha
          spot = find_move(2, rival, x, y, og_board);
          if (spot != "99")
            moves.push({
              spot: spot,
              h: heuristic_board[parseInt(spot.split("")[0])][
                parseInt(spot.split("")[1])
              ],
            });
        }
        if (x + 1 < 7 && og_board[y][x + 1] == rival) {
          // Derecha
          spot = find_move(3, rival, x, y, og_board);
          if (spot != "99")
            moves.push({
              spot: spot,
              h: heuristic_board[parseInt(spot.split("")[0])][
                parseInt(spot.split("")[1])
              ],
            });
        }
        if (y + 1 < 7 && x + 1 < 7 && og_board[y + 1][x + 1] == rival) {
          // Abajo Derecha
          spot = find_move(4, rival, x, y, og_board);
          if (spot != "99")
            moves.push({
              spot: spot,
              h: heuristic_board[parseInt(spot.split("")[0])][
                parseInt(spot.split("")[1])
              ],
            });
        }
        if (y + 1 < 7 && og_board[y + 1][x] == rival) {
          // Abajo
          spot = find_move(5, rival, x, y, og_board);
          if (spot != "99")
            moves.push({
              spot: spot,
              h: heuristic_board[parseInt(spot.split("")[0])][
                parseInt(spot.split("")[1])
              ],
            });
        }
        if (y + 1 < 7 && x - 1 > 0 && og_board[y + 1][x - 1] == rival) {
          // Abajo Izq
          spot = find_move(6, rival, x, y, og_board);
          if (spot != "99")
            moves.push({
              spot: spot,
              h: heuristic_board[parseInt(spot.split("")[0])][
                parseInt(spot.split("")[1])
              ],
            });
        }
        if (x - 1 > 0 && og_board[y][x - 1] == rival) {
          // Izquierda
          spot = find_move(7, rival, x, y, og_board);
          if (spot != "99")
            moves.push({
              spot: spot,
              h: heuristic_board[parseInt(spot.split("")[0])][
                parseInt(spot.split("")[1])
              ],
            });
        }
      }
    }
  }
}

function find_enemy_spots(turn, board) {
  let rival = turn == "1" ? "0" : "1";
  let spot;
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (board[y][x] == turn) {
        if (y - 1 > 0 && x - 1 > 0 && board[y - 1][x - 1] == rival) {
          // Arriba a la izq
          spot = find_move(0, rival, x, y, board);
          if (spot != "99")
            enemy_moves.push({
              spot: spot,
              h: heuristic_board[parseInt(spot.split("")[0])][
                parseInt(spot.split("")[1])
              ],
            });
        }
        if (y - 1 > 0 && board[y - 1][x] == rival) {
          // Arriba
          spot = find_move(1, rival, x, y, board);
          if (spot != "99")
            enemy_moves.push({
              spot: spot,
              h: heuristic_board[parseInt(spot.split("")[0])][
                parseInt(spot.split("")[1])
              ],
            });
        }
        if (y - 1 > 0 && x + 1 < 7 && board[y - 1][x + 1] == rival) {
          // Arriba Derecha
          spot = find_move(2, rival, x, y, board);
          if (spot != "99")
            enemy_moves.push({
              spot: spot,
              h: heuristic_board[parseInt(spot.split("")[0])][
                parseInt(spot.split("")[1])
              ],
            });
        }
        if (x + 1 < 7 && board[y][x + 1] == rival) {
          // Derecha
          spot = find_move(3, rival, x, y, board);
          if (spot != "99")
            enemy_moves.push({
              spot: spot,
              h: heuristic_board[parseInt(spot.split("")[0])][
                parseInt(spot.split("")[1])
              ],
            });
        }
        if (y + 1 < 7 && x + 1 < 7 && board[y + 1][x + 1] == rival) {
          // Abajo Derecha
          spot = find_move(4, rival, x, y, board);
          if (spot != "99")
            enemy_moves.push({
              spot: spot,
              h: heuristic_board[parseInt(spot.split("")[0])][
                parseInt(spot.split("")[1])
              ],
            });
        }
        if (y + 1 < 7 && board[y + 1][x] == rival) {
          // Abajo
          spot = find_move(5, rival, x, y, board);
          if (spot != "99")
            enemy_moves.push({
              spot: spot,
              h: heuristic_board[parseInt(spot.split("")[0])][
                parseInt(spot.split("")[1])
              ],
            });
        }
        if (y + 1 < 7 && x - 1 > 0 && board[y + 1][x - 1] == rival) {
          // Abajo Izq
          spot = find_move(6, rival, x, y, board);
          if (spot != "99")
            enemy_moves.push({
              spot: spot,
              h: heuristic_board[parseInt(spot.split("")[0])][
                parseInt(spot.split("")[1])
              ],
            });
        }
        if (x - 1 > 0 && board[y][x - 1] == rival) {
          // Izquierda
          spot = find_move(7, rival, x, y, board);
          if (spot != "99")
            enemy_moves.push({
              spot: spot,
              h: heuristic_board[parseInt(spot.split("")[0])][
                parseInt(spot.split("")[1])
              ],
            });
        }
      }
    }
  }
}

function fill_board(estado) {
  var y = 0,
    x = 0;
  if (estado != undefined) {
    for (let z = 0; z < estado.length; z++) {
      og_board[y][x] = estado[z];
      x++;
      if (x == 8) {
        x = 0;
        y++;
      }
    }
  }
}

app.get("/", (req, res) => {
  //variable reset
  moves = [];
  enemy_moves = [];

  var { turno, estado } = req.query;
  estado = estado?.split("");
  fill_board(estado);
  find_spots(turno);
  console.log("----------------------------------------");
  console.table(moves);
  sort_and_clean_moves();
  minimax(turno);
  console.log(`El turno es: ${turno}`);
  console.log(`El spot es: ${moves[0].spot}`);
  if (moves.length > 1) {
    if (moves.length > 3 && moves[0].h == moves[1].h && moves[1].h == moves[2].h) {
      let indx = getRandomInt(3);
      console.log(indx);
      console.log(`El spot random es: ${moves[indx].spot}`);
      res.send(moves[indx].spot);
    } else {
      if (moves[0].h == moves[1].h) {
        let indx = getRandomInt(2);
        console.log(indx);
        console.log(`El spot random es: ${moves[indx].spot}`);
        res.send(moves[indx].spot);
      } else res.send(moves[0].spot);
    }
  } else res.send(moves[0].spot);
});

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

app.listen(port, () => {
  console.log(`Proyecto corriendo en http://localhost:${port}`);
});