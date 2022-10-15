// Const declaration
const tools = require('./tools.js');
const db = require('./db.js');
const tanks = require('./tanks.js');

// Global Var
var config = null;
var timer = 0;
var message_counter = 0;
var total_auto_cmd_time = 0;
var total_auto_cmd_msg = 0;
var last_auto_cmd = 0;
var time_interval = null; //Trigger auto des cmd (en minutes)
var message_interval = null;  //Trigger auto des cmd (en nb de msg)

// Function declaration
function init(config_init, socket_init){
    socket = socket_init;
    config = config_init;

    time_interval = config["cmd_time_interval"];
    message_interval = config["cmd_msg_interval"];
}

async function timeTrigger(){
	timer++;
	socket.time_trigger_update(timer, time_interval, total_auto_cmd_time);
	if(timer >= time_interval){
		timer = 0;
		total_auto_cmd_time++;
		return await auto_command();
	}
	return false;
}

async function msgTrigger(){
	message_counter++;
	socket.msg_trigger_update(message_counter, message_interval, total_auto_cmd_msg);
	if(message_counter >= message_interval){
		message_counter = 0;
		total_auto_cmd_msg++;
		return await auto_command();
    }
	return false;
}

async function load_auto_command(){
    var sql = await db.query("SELECT `command` FROM commands WHERE auto = 1");
    var result = [];

    try {
        sql.forEach(element => {result.push(element.command);});
        return result;
    }
    catch (err){
        console.error(err);
    }
}

async function auto_command(){
    ///Boucle des commandes automatiques
    var list = await load_auto_command();
    var index;

	do{
		index = Math.floor(Math.random() * Math.floor(list.length));
	}while(index == last_auto_cmd && list.length > 1)

    last_auto_cmd = index;

	return await run(null, config['cmd_prefix'] + list[index]);		
}

async function get_alias(request){
    var sql = "SELECT command FROM alias_commands WHERE alias='" + request + "'";
    var res = await db.query(sql);

    try {
        if(res[0])
            return res[0].command;
        else
            return request;
    }
    catch (err){
        console.error(err);
        return null;
    }
}

async function get_command(request){
    var sql = "SELECT value FROM commands WHERE command='" + request + "'";
    var res = await db.query(sql);

    try {
        if(res[0])
            return res[0].value;
        else
            return null;
    }
    catch (err){
        console.error(err);
        return null;
    }
}

async function run(user, message){
    var result = null;
	var fullCommand = tools.commandParser(message, config['cmd_prefix']);

    // Not a command
	if(!fullCommand) return null;

    // Sanitize
	var command = fullCommand[1].toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
	var param = fullCommand[2].toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "");

    // Alias
    command = await get_alias(command);
    
    // Tank
    if(command == "char"){
        return await tanks.hangar(param);
    }
    
    // Text
    result = await get_command(command);
    if (result){
        if(user) 
            result = result.replace("@username", user['display-name']);

        return result;
    }
        
    return null;
}

module.exports = {init, run, auto_command, timeTrigger, msgTrigger}