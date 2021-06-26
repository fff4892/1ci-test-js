var currentState = true;
var stopBtn = document.getElementById("stop");
var contBtn = document.getElementById("continue");
	
var updateState = function(){
	chrome.storage.sync.set({"state": currentState});
	stopBtn.disabled = !currentState;
	contBtn.disabled = currentState;
}

var notifyBackground = function(){
	chrome.runtime.sendMessage(null, { method: "set", state: currentState });
}

document.addEventListener("DOMContentLoaded", function(){
	
	chrome.storage.sync.get("state", function(data){
		currentState = data.state;
		updateState();
	});
	
	stopBtn.addEventListener("click", function(){
		currentState = false;
		updateState();
	});

	contBtn.addEventListener("click", function(){
		currentState = true;
		updateState();
	});
});
