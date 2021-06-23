const express = require('express')
const app = express()
const port = process.env.PORT||3000 

app.get('/', (req, res) => {
  console.log(req.query.turno)
  console.log(req.query.estado)
  var turno = req.query.turno
  var estado = req.query.estado
  var matrix = toMatrix(estado.toString());
  
  minimax(turno, matrix, true, 1, 2)
  
  
  res.send('24');
})

function minimax(turno, estado, maximizando, profundidad,  maxprof){ 
  if(profundidad==maxprof){
    return;
  }
  var movimientosposibles = getMovimientosPosibles(turno, estado); 
  var estadoshijos = [];
  for(i in movimientosposibles){
    var nuevoestado = ejecutarEstado(turno, estado, movimientosposibles[i]);
    estadoshijos.push(nuevoestado);
  }

}

function ejecutarEstado(turno, estado, movimiento){
  var nuevoestado = []
  for(i=0;i<8;i++){
    nuevoestado.push('')
    for(j=0;j<8;j++){
      if(movimiento[0]==i&&movimiento[1]==j){
        nuevoestado[i] += turno
      }else{
        console.log(nuevoestado[i]);
        nuevoestado[i] += estado[i][j] 
      }
    }
  }
  return nuevoestado
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})



function getMovimientosPosibles(turno, estado){
  
  var movimientos = [];
  for(i=0;i<8;i++){
    for(j=0;j<8;j++){
      var comida = isLegalMove(estado, turno, i,j);
      if(comida>0){
        movimientos.push([i,j,comida]);
      }
    }
  }
  return movimientos;
}

function isLegalMove(estado, turno, fila, columna){
  if(estado[fila][columna]!='2'){
    return 0;
  }
  return  puedeComer(estado, turno, fila, columna)
}

function puedeComer(estado, turno, fila, columna){
  
  var oponente = '1'
  
  if(turno=='1'){
    oponente = '0'
  }
  var comidatotal = 0;
  var comida = 0 
  var i = fila-1 
  var j = columna-1
  var amiga = false 
  var vacio = false 
  while(i>=0 && j>=0 && !amiga && !vacio){
    if(estado[i][j]==oponente){
      comida++
    }else if(estado[i][j]=='2'){ 
      vacio = true
    }else if(estado[i][j]==turno){
      amiga = true
    }
    i--;
    j--;
  }
  if(amiga){
    comidatotal += comida
  } 
  
  comida = 0
  i = fila -1
  j = columna
  amiga = false 
  vacio = false 
  while(i>=0 && !amiga && !vacio){
    if(estado[i][j]==oponente){
      comida++
    }else if(estado[i][j]=='2'){ 
      vacio = true
    }else if(estado[i][j]==turno){
      amiga = true
    }
    i--;
  }
  if(amiga){
    comidatotal += comida
  }
  
  comida = 0 
  i = fila -1
  j = columna +1
  amiga = false 
  vacio = false 
  while( i>=0 && j<8 && !amiga && !vacio ){
    if(estado[i][j]==oponente){ 
      comida++
    }else if(estado[i][j]=='2'){
      vacio = true
    }else if(estado[i][j]==turno){
      amiga = true
    }
    i--;
    j++;
  }
  if(amiga){
    comidatotal += comida
  } 
 
  comida = 0 
  i = fila 
  j = columna+1
  amiga = false  
  vacio = false 
  while(j<8 && !amiga && !vacio ){
    if(estado[i][j]==oponente){ 
      comida++
    }else if(estado[i][j]=='2'){ 
      vacio = true
    }else if(estado[i][j]==turno){
      amiga = true
    }
    j++;
  }
  if(amiga){
    comidatotal += comida
  } 
 
  comida = 0 
  i = fila +1
  j = columna +1
  amiga = false 
  vacio = false
  while( i<8 && j<8 && !amiga && !vacio ){
    if(estado[i][j]==oponente){ 
      comida++
    }else if(estado[i][j]=='2'){ 
      vacio = true
    }else if(estado[i][j]==turno){
      amiga = true
    }
    i++;
    j++;
  }
  if(amiga){
    comidatotal += comida
  } 
  
  comida = 0 
  i = fila +1 
  j = columna
  amiga = false 
  vacio = false 
  while( i<8 && !amiga && !vacio ){
    if(estado[i][j]==oponente){ 
      comida++
    }else if(estado[i][j]=='2'){ 
      vacio = true
    }else if(estado[i][j]==turno){
      amiga = true
    }
    i++;
  }
  if(amiga){
    comidatotal += comida
  }
  
  comida = 0 
  i = fila +1
  j = columna-1
  amiga = false 
  vacio = false  
  while( i<8 && j>=0 && !amiga && !vacio ){
    if(estado[i][j]==oponente){
      comida++
    }else if(estado[i][j]=='2'){ 
      vacio = true
    }else if(estado[i][j]==turno){
      amiga = true
    }
    i++;
    j--;
  }
  if(amiga){
    comidatotal += comida
  }
  
  comida = 0 
  i = fila 
  j = columna-1
  amiga = false
  vacio = false
  while( j>=0 && !amiga && !vacio ){
    if(estado[i][j]==oponente){
      comida++
    }else if(estado[i][j]=='2'){
      vacio = true
    }else if(estado[i][j]==turno){
      amiga = true
    }
    j--;
  }
  if(amiga){
    comidatotal += comida
  }

  return comidatotal;
}

function toMatrix(arreglo){
  var size = 8;
  var res = []; 
  for(var i=0;i < arreglo.length; i = i+size)
  res.push(arreglo.slice(i,i+size));
  return res;
}

/*function obtenerValorParametro(sParametroNombre) {
    var sPaginaURL = window.location.search.substring(1);
     var sURLVariables = sPaginaURL.split('&');
      for (var i = 0; i < sURLVariables.length; i++) {
        var sParametro = sURLVariables[i].split('=');
        if (sParametro[0] == sParametroNombre) {
          return sParametro[1];
        }
      }
     return null;
}
var turno = obtenerValorParametro('turno');
var estado = obtenerValorParametro('estado');
body = document.body.innerText = turno;
console.log("Turno: " + turno);
console.log("Estado: " + estado);
//body=document.body.innerTex = " Estado" + estado;
//body = document.body.innerText = 35;
*/