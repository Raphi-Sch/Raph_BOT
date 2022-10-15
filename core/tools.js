function getRandomInt(max){
    ///Return a random number between 0 and max
    return Math.floor(Math.random() * Math.floor(max+1));
}

function commandParser(message, prefix){
	///Commande Parser, sépare commande et paramètre de commande
    let prefixEscaped = prefix.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
    let regex = new RegExp("^" + prefixEscaped + "([a-zA-Z1-9]+)\s?(.*)");
    return regex.exec(message);
}

function max_array_index(array, start){
    var max = 0;
    var index = start;
    for(i = start; i < array.length; i++){
        if(array[i] > max){
            index = i
            max = array[i]
        }
    }
    return index;
}

module.exports = {commandParser, getRandomInt, max_array_index}