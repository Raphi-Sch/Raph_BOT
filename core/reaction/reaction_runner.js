import tools from "../tools"
import socket from "../socket"
import db from "../db"

let exclusion = [];

function run_reaction(user, message) {
  let words = tools.normalize_string(message).replace(/['"]+/g, ' ').split(" ");
  let result = query_reaction(words);

  try {
    if (result) {
      if (tools.get_random_int(100) <= result.frequency) {
        if (result.timeout > 0) {
          exclusion.push(result.trigger_word);

          setTimeout(function () {
            exclusion.splice(exclusion.indexOf(result.trigger_word), 1);
            socket.log(`[REACTION] ${result.trigger_word} has been removed from the exclusion list`);
          }, result.timeout * 1000);

          socket.log(`[REACTION] ${result.trigger_word} has been excluded for ${result.timeout}s`);
        }
        return result.reaction.replace("@username", user['display-name']);
      }
    }
  } catch (err) {
    console.error(err);
    return null;
  }
}

function query_reaction(words) {
  const filtered_words = words.filter(word => word !== '' && word !== null)
  const trigger_word_in = filtered_words.map(() => "?").join(",")

  let trigger_word_not_in = "";
  if (exclusion.length > 0) {
    trigger_word_not_in = `AND reactions.trigger_word NOT IN (${exclusion.map(() => "?").join(",")})`;
  }

  const values = [];
  filtered_words.forEach(word => values.push(word))
  exclusion.forEach(word => values.push(word))

  const res = db.query(`SELECT trigger_word, reaction, frequency, timeout
                                FROM reactions
                                WHERE reactions.trigger_word IN (${trigger_word_in})
                                ${trigger_word_not_in}
                                ORDER BY RAND() LIMIT 1`, values);

  return tools.first_of_array(res);
}

module.exports = {run_reaction}