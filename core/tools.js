function get_random_int(max){
    ///Return a random number between 0 and max
    return Math.floor(Math.random() * Math.floor(max+1));
}

function command_parser(message, prefix){
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

function normalize_string(str) {
    return str.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

function first_of_array(array){
    try {
        if (array[0]) {
            return array[0];
        }
    }
    catch (err) {
        console.error(err);
        return null;
    }
}

module.exports = {command_parser, get_random_int, max_array_index, normalize_string, first_of_array}