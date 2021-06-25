const express = require("express");
const app = express();
const port = 8080;

app.listen(port, () => {
  console.log(`Proyecto en puerto> ${port}`);
});

app.get("/", (req, res) => {
  let turno = req.query.turno;
  let estado = req.query.estado;
  if (estado) {
    toMatriz(estado);
    let posiciones = getPosiciones(turno, tableroJuego);
    let valid_moves = getMovimientosValidos(turno, posiciones, tableroJuego);
    let arbol = [];
    for (let i = 0; i < valid_moves.length; i++) {
      let result = continuar(valid_moves[i], valid_moves[i].value);
      arbol.push(result);
    }
    let move_to = `${moveTo(arbol, turno, -9999999, 0)}`;
    console.log("IA: MOVED TO " + move_to);
    return res.send(move_to);
  }
  console.log("No hay estado");
  res.send("24");
});

var tableroJuego = new Array(8);
for (let i = 0; i < tableroJuego.length; i++) {
  tableroJuego[i] = new Array(8);
}

const heuristica = new Array(8);
heuristica[0] = [120, -20, 20, 10, 10, 20, -20, 120];
heuristica[1] = [-20, -40, -5, -5, -5, -5, -40, -20];
heuristica[2] = [20, -5, 15, 3, 3, 15, -5, 20];
heuristica[3] = [10, -5, 3, 3, 3, 3, -5, 10];
heuristica[4] = [10, -5, 3, 3, 3, 3, -5, 10];
heuristica[5] = [20, -5, 15, 4, 4, 15, -5, 20];
heuristica[6] = [-20, -40, -5, -5, -5, -5, -40, -20];
heuristica[7] = [120, -20, 20, 10, 10, 20, -20, 120];

function toMatriz(estado) {
  let iterador = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      tableroJuego[i][j] = estado[iterador];
      iterador++;
    }
  }
}

function getPosiciones(turno, tablero) {
  let posiciones = [];
  let contador = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (turno == tablero[i][j]) {
        posiciones[contador] = {
          row: i,
          column: j,
          value: calcularValor({ row: i, column: j }),
        };
        contador++;
      }
    }
  }
  return posiciones;
}

function calcularValor(posicion) {
  return heuristica[posicion.row][posicion.column];
}

function bloqueo(posicion, turno) {
  if (tableroJuego[posicion.row][posicion.column] != 2) {
    return true;
  }
  return false;
}

function continuar(posicion, valor) {
  valor += calcularValor(posicion);
  try {
    if (posicion.direccion == "N") {
      let nex_position = {
        ...posicion,
        row: posicion.row - 1,
        column: posicion.column,
      };
      if (bloqueo(posicion)) {
        return continuar(nex_position, calcularValor(nex_position));
      }
      return {
        ...posicion,
        heuristica: valor + calcularValor(nex_position),
      };
    }
    if (posicion.direccion == "E") {
      let nex_position = {
        ...posicion,
        row: posicion.row,
        column: posicion.column + 1,
      };
      if (bloqueo(posicion)) {
        return continuar(nex_position, calcularValor(nex_position));
      }
      return {
        ...posicion,
        heuristica: valor + calcularValor(nex_position),
      };
    }
    if (posicion.direccion == "SE") {
      let nex_position = {
        ...posicion,
        row: posicion.row + 1,
        column: posicion.column + 1,
      };
      if (bloqueo(posicion)) {
        return continuar(nex_position, calcularValor(nex_position));
      }
      return {
        ...posicion,
        heuristica: valor + calcularValor(nex_position),
      };
    }
    if (posicion.direccion == "S") {
      let nex_position = {
        ...posicion,
        row: posicion.row + 1,
        column: posicion.column,
      };
      if (bloqueo(posicion)) {
        return continuar(nex_position, calcularValor(nex_position));
      }
      return {
        ...posicion,
        heuristica: valor + calcularValor(posicion),
      };
    }
    if (posicion.direccion == "O") {
      let nex_position = {
        ...posicion,
        row: posicion.row,
        column: posicion.column - 1,
      };
      if (bloqueo(posicion)) {
        return continuar(nex_position, calcularValor(nex_position));
      }
      return {
        ...posicion,
        heuristica: valor + calcularValor(posicion),
      };
    }
    if (posicion.direccion == "NE") {
      let nex_position = {
        ...posicion,
        row: posicion.row - 1,
        column: posicion.column + 1,
      };
      if (bloqueo(posicion)) {
        return continuar(nex_position, calcularValor(nex_position));
      }
      return {
        ...posicion,
        heuristica: valor + calcularValor(posicion),
      };
    }
    if (posicion.direccion == "SO") {
      let nex_position = {
        ...posicion,
        row: posicion.row + 1,
        column: posicion.column - 1,
      };
      if (bloqueo(posicion)) {
        return continuar(nex_position, calcularValor(nex_position));
      }
      return {
        ...posicion,
        heuristica: valor + calcularValor(nex_position),
      };
    }
    if (posicion.direccion == "NO") {
      let nex_position = {
        ...posicion,
        row: posicion.row - 1,
        column: posicion.column - 1,
      };
      if (bloqueo(posicion)) {
        return continuar(nex_position, calcularValor(nex_position));
      }
      return {
        ...posicion,
        heuristica: valor + calcularValor(nex_position),
      };
    }
  } catch (TypeError) {
    console.log("No se pudo encontrar una posicion valida para la ficha.");
    return 0; // No se pudo encontrar una posicion a la ficha
  }
}

function getMovimientosValidos(turno, posiciones, tablero) {
  let row = 0;
  let column = 0;
  let valid_moves = [];

  for (let i = 0; i < posiciones.length; i++) {
    row = posiciones[i].row;
    column = posiciones[i].column;
    value = posiciones[i].value;
    if (row > 0 && row < 7 && column > 0 && column < 7) {
      let N = tablero[row - 1][column];
      let NE = tablero[row - 1][column + 1];
      let E = tablero[row][column + 1];
      let SE = tablero[row + 1][column + 1];
      let S = tablero[row + 1][column];
      let SO = tablero[row + 1][column - 1];
      let O = tablero[row][column - 1];
      let NO = tablero[row - 1][column - 1];
      // N
      if (N != "2" && N != turno) {
        valid_moves.push({
          row: row - 1,
          column: column,
          direccion: "N",
          value: value,
        });
      }
      // NE
      if (NE != "2" && NE != turno) {
        valid_moves.push({
          row: row - 1,
          column: column + 1,
          direccion: "NE",
          value: value,
        });
      }
      // E
      if (E != "2" && E != turno) {
        valid_moves.push({
          row: row,
          column: column + 1,
          direccion: "E",
          value: value,
        });
      }
      // SE
      if (SE != "2" && SE != turno) {
        valid_moves.push({
          row: row + 1,
          column: column + 1,
          direccion: "SE",
          value: value,
        });
      }
      // S
      if (S != "2" && S != turno) {
        valid_moves.push({
          row: row + 1,
          column: column,
          direccion: "S",
          value: value,
        });
      }
      // So
      if (SO != "2" && SO != turno) {
        valid_moves.push({
          row: row + 1,
          column: column - 1,
          direccion: "SO",
          value: value,
        });
      }
      // O
      if (O != "2" && O != turno) {
        valid_moves.push({
          row: row,
          column: column - 1,
          direccion: "O",
          value: value,
        });
      }
      // No
      if (NO != "2" && NO != turno) {
        valid_moves.push({
          row: row - 1,
          column: column - 1,
          direccion: "No",
          value: value,
        });
      }
    } else if (row > 0 && row < 7 && column == 0) {
      let N = tablero[row - 1][column];
      let NE = tablero[row - 1][column + 1];
      let E = tablero[row][column + 1];
      let SE = tablero[row + 1][column + 1];
      let S = tablero[row + 1][column];
      // N
      if (N != "2" && N != turno) {
        valid_moves.push({
          row: row - 1,
          column: column,
          direccion: "N",
          value: value,
        });
      }
      // NE
      if (NE != "2" && NE != turno) {
        valid_moves.push({
          row: row - 1,
          column: column + 1,
          direccion: "NE",
          value: value,
        });
      }
      // E
      if (E != "2" && E != turno) {
        valid_moves.push({
          row: row,
          column: column + 1,
          direccion: "E",
          value: value,
        });
      }
      // SE
      if (SE != "2" && SE != turno) {
        valid_moves.push({
          row: row + 1,
          column: column + 1,
          direccion: "SE",
          value: value,
        });
      }
      // S
      if (S != "2" && S != turno) {
        valid_moves.push({
          row: row + 1,
          column: column,
          direccion: "S",
          value: value,
        });
      }
    } else if (row > 0 && row < 7 && column == 7) {
      let N = tablero[row - 1][column];
      let S = tablero[row + 1][column];
      let SO = tablero[row + 1][column - 1];
      let O = tablero[row][column - 1];
      let NO = tablero[row - 1][column - 1];
      // N
      if (N != "2" && N != turno) {
        valid_moves.push({
          row: row - 1,
          column: column,
          direccion: "N",
          value: value,
        });
      }
      // S
      if (S != "2" && S != turno) {
        valid_moves.push({
          row: row + 1,
          column: column,
          direccion: "S",
          value: value,
        });
      }
      // So
      if (SO != "2" && SO != turno) {
        valid_moves.push({
          row: row + 1,
          column: column - 1,
          direccion: "SO",
          value: value,
        });
      }
      // O
      if (O != "2" && O != turno) {
        valid_moves.push({
          row: row,
          column: column - 1,
          direccion: "O",
          value: value,
        });
      }
      // No
      if (NO != "2" && NO != turno) {
        valid_moves.push({
          row: row - 1,
          column: column - 1,
          direccion: "No",
          value: value,
        });
      }
    } else if (column > 0 && column < 7 && row == 0) {
      let E = tablero[row][column + 1];
      let SE = tablero[row + 1][column + 1];
      let S = tablero[row + 1][column];
      let SO = tablero[row + 1][column - 1];
      let O = tablero[row][column - 1];
      // E
      if (E != "2" && E != turno) {
        valid_moves.push({
          row: row,
          column: column + 1,
          direccion: "E",
          value: value,
        });
      }
      // SE
      if (SE != "2" && SE != turno) {
        valid_moves.push({
          row: row + 1,
          column: column + 1,
          direccion: "SE",
          value: value,
        });
      }
      // S
      if (S != "2" && S != turno) {
        valid_moves.push({
          row: row + 1,
          column: column,
          direccion: "S",
          value: value,
        });
      }
      // So
      if (SO != "2" && SO != turno) {
        valid_moves.push({
          row: row + 1,
          column: column - 1,
          direccion: "SO",
          value: value,
        });
      }
      // O
      if (O != "2" && O != turno) {
        valid_moves.push({
          row: row,
          column: column - 1,
          direccion: "O",
          value: value,
        });
      }
    } else if (column > 0 && column < 7 && row == 7) {
      let N = tablero[row - 1][column];
      let NE = tablero[row - 1][column + 1];
      let E = tablero[row][column + 1];
      let O = tablero[row][column - 1];
      let NO = tablero[row - 1][column - 1];
      // N
      if (N != "2" && N != turno) {
        valid_moves.push({
          row: row - 1,
          column: column,
          direccion: "N",
          value: value,
        });
      }
      // NE
      if (NE != "2" && NE != turno) {
        valid_moves.push({
          row: row - 1,
          column: column + 1,
          direccion: "NE",
          value: value,
        });
      }
      // E
      if (E != "2" && E != turno) {
        valid_moves.push({
          row: row,
          column: column + 1,
          direccion: "E",
          value: value,
        });
      }
      // O
      if (O != "2" && O != turno) {
        valid_moves.push({
          row: row,
          column: column - 1,
          direccion: "O",
          value: value,
        });
      }
      // No
      if (NO != "2" && NO != turno) {
        valid_moves.push({
          row: row - 1,
          column: column - 1,
          direccion: "No",
          value: value,
        });
      }
    } else if (column == 0 && row == 0) {
      let E = tablero[row][column + 1];
      let SE = tablero[row + 1][column + 1];
      let S = tablero[row + 1][column];
      // E
      if (E != "2" && E != turno) {
        valid_moves.push({
          row: row,
          column: column + 1,
          direccion: "E",
          value: value,
        });
      }
      // SE
      if (SE != "2" && SE != turno) {
        valid_moves.push({
          row: row + 1,
          column: column + 1,
          direccion: "SE",
          value: value,
        });
      }
      // S
      if (S != "2" && S != turno) {
        valid_moves.push({
          row: row + 1,
          column: column,
          direccion: "S",
          value: value,
        });
      }
    } else if (column == 7 && row == 0) {
      let S = tablero[row + 1][column];
      let SO = tablero[row + 1][column - 1];
      let O = tablero[row][column - 1];
      // S
      if (S != "2" && S != turno) {
        valid_moves.push({
          row: row + 1,
          column: column,
          direccion: "S",
          value: value,
        });
      }
      // So
      if (SO != "2" && SO != turno) {
        valid_moves.push({
          row: row + 1,
          column: column - 1,
          direccion: "SO",
          value: value,
        });
      }
      // O
      if (O != "2" && O != turno) {
        valid_moves.push({
          row: row,
          column: column - 1,
          direccion: "O",
          value: value,
        });
      }
    } else if (column == 7 && row == 7) {
      let N = tablero[row - 1][column];
      let O = tablero[row][column - 1];
      let NO = tablero[row - 1][column - 1];
      // N
      if (N != "2" && N != turno) {
        valid_moves.push({
          row: row - 1,
          column: column,
          direccion: "N",
          value: value,
        });
      }
      // O
      if (O != "2" && O != turno) {
        valid_moves.push({
          row: row,
          column: column - 1,
          direccion: "O",
          value: value,
        });
      }
      // No
      if (NO != "2" && NO != turno) {
        valid_moves.push({
          row: row - 1,
          column: column - 1,
          direccion: "No",
          value: value,
        });
      }
    } else if (column == 0 && row == 7) {
      let N = tablero[row - 1][column];
      let NE = tablero[row - 1][column + 1];
      let E = tablero[row][column + 1];
      // N
      if (N != "2" && N != turno) {
        valid_moves.push({
          row: row - 1,
          column: column,
          direccion: "N",
          value: value,
        });
      }
      // NE
      if (NE != "2" && NE != turno) {
        valid_moves.push({
          row: row - 1,
          column: column + 1,
          direccion: "NE",
          value: value,
        });
      }
      // E
      if (E != "2" && E != turno) {
        valid_moves.push({
          row: row,
          column: column + 1,
          direccion: "E",
          value: value,
        });
      }
    }
  }
  return valid_moves;
}

function imprimirValor(posicion) {
  return tableroJuego[posicion.row][posicion.column];
}
function moveTo(movimientos, turno, max, index) {
  if (movimientos.length > 1) {
    movimientos.sort((a, b) => (a.heuristica > b.heuristica ? 1 : -1));
    console.log(movimientos);
  }
  if (movimientos.length === 0) {
    console.log("Sin movimientos posibles");
    return "00";
  }

  let res = {};
  do {
    res = movimientos.pop();
  } while (typeof res === "undefined");

  console.log("Turno: " + turno + " OCUPADO POR " + imprimirValor(res));
  console.dir(res);

  return `${res.row}${res.column}`;
}