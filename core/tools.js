function get_random_int(max) {
    ///Return a random number between 0 and max
    return Math.floor(Math.random() * Math.floor(max + 1));
}

function command_parser(message, prefix) {
    ///Commande Parser, sépare commande et paramètre de commande
    let prefixEscaped = prefix.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
    let regex = new RegExp("^" + prefixEscaped + "([a-zA-Z1-9]+)\s?(.*)");
    return regex.exec(message);
}

function normalize_string(str) {
    return str.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

function first_of_array(array) {
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

function timeout_to_string(seconds) {
    if(seconds >= 3600)
        return parseInt(seconds / 3600) + " hour";

    if(seconds >= 60)
        return parseInt(seconds / 60) + " min";

    if(seconds == 0)
        return "No timeout";

    return seconds + "s";
}

module.exports = { command_parser, get_random_int, normalize_string, first_of_array, timeout_to_string }