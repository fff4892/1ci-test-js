var elements = [];
var currentState = true; 

chrome.storage.sync.get("state", function(data){
	currentState = data.state;
});
	
chrome.storage.onChanged.addListener(function (changes, namespace) {
	for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
		if (key == "state"){
			currentState = newValue;
			elements.forEach((node) => resetElement(node, currentState));
		}
	}
});

var updateElements = function(context, state){
	var nodeIterator = document.createNodeIterator(context, NodeFilter.SHOW_TEXT);
	while (currentNode = nodeIterator.nextNode()){
		if (elements.find(item => item.node == currentNode) != null){
			continue;
		}
		var node = {
			node: currentNode,
			text: currentNode.textContent
		};
		elements.push(node);
		resetElement(node, state);
	}
}

var resetElement = function(node, state){
	if (state){
		node.node.textContent = node.node.textContent.replaceAll("а", () => Math.floor(Math.random() * 10));
	} else {
		node.node.textContent = node.text;
	}
}

var removeNode = function(node){
	index = elements.findIndex(item => item.node == node);
	if (index != -1){
		elements.splice(index, 1);
	}
}

var domMutationCallback = function(mutationsList, observer){
	for (const mutation of mutationsList){
		for (var node of mutation.addedNodes){
			updateElements(node, currentState);
		}
		for (var node of mutation.removedNodes){
			removeNode(node);
		}
	}
}
	
const context = document.querySelector("body");
updateElements(context, currentState);

const observer = new MutationObserver(domMutationCallback);
const config = { attributes: false, childList: true, subtree: true };
observer.observe(context, config);

