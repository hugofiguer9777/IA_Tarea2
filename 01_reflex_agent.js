// MIT License
// Copyright (c) 2020 Luis Espino

function reflex_agent(location, state){
   	if (state=="DIRTY") return "CLEAN";
   	else if (location=="A") return "RIGHT";
   	else if (location=="B") return "LEFT";
}

function test(states){
	var location = states[0];		
	var state = states[0] == "A" ? states[1] : states[2];
	var action_result = reflex_agent(location, state);
	document.getElementById("log").innerHTML+="<br>Lugar: ".concat(location).concat(" | Accion: ").concat(action_result);
	if (action_result == "CLEAN"){
		contador = 0;
		if (location == "A") states[1] = "CLEAN";
		else if (location == "B") states[2] = "CLEAN";
	}
	else if (action_result == "RIGHT"){
		states[0] = "B";
		contador+=1;
	}
	else if (action_result == "LEFT"){
		states[0] = "A";
		contador+=1;
	}
	setTimeout(function(){ test(states); }, 2000);
}

var states = ["A","DIRTY","DIRTY"];
var contador = 0;
test(states);
