# Commands

## List text commands

### Query 
```
Method : GET
URL : http://<web_server>/api/commands.php?list-text
```

### Headers
Name | Value
--- | ----
Authorization |  Bearer YOUR_TOKEN
Client | CLIENT_ID

### Response body
Field | Type | Description
---|---|---
id | Integer | ID of the command in the database
command | String | The trigger of the command
value | String | The value of the command
auto | Boolean | Is the command execute automatically
mod_only | Boolean | Is the command only available to moderator
sub_only | Boolean | Is the command only available to subscriber and moderator

### Exemple response
```json
[
    {
        "id": 1,
        "command": "command1",
        "value": "Text of command 1",
        "auto": 0,
        "mod_only": 0,
        "sub_only": 0
    },
    {
        "id": 2,
        "command": "command2",
        "value": "Text of command 2",
        "auto": 0,
        "mod_only": 1,
        "sub_only": 0
    }
]
```

## List auto commands

### Query 
```
Method : GET
URL : http://<web_server>/api/commands.php?list-auto
```

### Headers
Name | Value
--- | ----
Authorization |  Bearer YOUR_TOKEN
Client | CLIENT_ID

### Exemple response 1
```json
[
    "auto1",
    "auto2"
]
```

### Exemple response 2
```json
[]
```

## List command alias

### Query
```
Method : GET
URL : http://<web_server>/api/commands.php?list-alias
```

### Headers
Name | Value
--- | ----
Authorization |  Bearer YOUR_TOKEN
Client | CLIENT_ID

### Response body
Field | Type | Description
---|---|---
id | Integer | ID of the alias in the database
alias | String | The alias of the command
command | String | The command link to that alias

### Exemple response
```json
[
    {
        "id" : 1
        "alias": "alias1",
        "command": "command1"
    },
    {
        "id" : 2
        "alias": "alias2",
        "command": "command2"
    }
]
```

### Exemple response 2
```json
[]
```

## List audio command

### Query 
```
Method : GET
URL : http://<web_server>/api/commands.php?list-audio
```

### Headers
Name | Value
--- | ----
Authorization |  Bearer YOUR_TOKEN
Client | CLIENT_ID

### Response body
Field | Type | Description
---|---|---
id | Integer | ID of the audio command in the database
name | String | The name of the audio command
trigger_word | String | The trigger of the audio command
volume | Float | The volume of the audio command (between 0 and 1)
timeout | Integer | The timeout of the audio command in seconds
file | String | The name of the audio file
active | Boolean | Is the audio command active
mod_only | Boolean | Is the command only available to moderator
sub_only | Boolean | Is the command only available to subscriber and moderator

### Exemple response 1
```json
[
    {
        "id": 1,
        "name": "Discord ping",
        "trigger_word": "ping",
        "volume": 0.2,
        "timeout": 0,
        "file": "45420fd2-3bba-4838-9102-20461499fe8f.mp3",
        "active": 1,
        "mod_only": 1,
        "sub_only": 0
    },
    {
        "id": 2,
        "name": "door",
        "trigger_word": "door",
        "volume": 0.85,
        "timeout": 0,
        "file": "f95cbd23-9901-474f-87ee-bb2cc0c7a484.mp3",
        "active": 1,
        "mod_only": 0,
        "sub_only": 0
    }
]
```

### Exemple response 2
```json
[]
```

## Query specific command

### Query
```
Method : POST
URL : http://<web_server>/api/commands.php?request
```

### Headers
Name | Value
--- | ----
Authorization |  Bearer YOUR_TOKEN
Client | CLIENT_ID

### Request query parameters
Field | Type | Required | Description
---|---|---|---
command | String | Yes | Command requested
param | String | No | Addition parameters of the command
excluded_tanks | Array | No | List of all excluded tanks ID (for "tank random"), can be empty or not set
excluded_audio | Array | No | List of all excluded audio ID (for audio command), can be empty or not set

### Response body
Field | Type | When | Description
---|---|---|---
reponse_type | String | Always | What type of response the API gave you
mod_only | Boolean | Always |  Is the command only available to moderator
sub_only | Boolean | Always |  Is the command only available to subscriber and moderator
value | String | response_type is not 'audio' | Text to send to chat
trigger_word | String | response_type is 'audio' | Trigger of the audio command (use for timeout list)
volume | Integer | response_type is 'audio' | The timeout of the audio command in seconds 
file | String | response_type is 'audio' | File link to the audio command
name | String | response_type is 'audio' | Name of the audio command
volume | Float | response_type is 'audio' | Volume for audio playback
exclude | Integer | response_type is 'tank-random' | ID of the tank to exclude
total | Integer | response_type is 'tank-random' | Number of tank available for the command 'tank random'
tts_type | String | response_type is 'tts' | Either 'user' or 'bot', depending on who issued the command

### Exemple Request 1
```json
{
    "command": "debug"
}
```

### Exemple Response 1
```json
{
    "response_type": "text",
    "value": "Text for command debug",
    "mod_only": 0,
    "sub_only": 0
}
```

### Exemple Request 2
```json
{
    "command":"sax",
    "excluded_audio":[]
}
```

### Exemple Response 2
```json
{
    "response_type": "audio",
    "id": 5,
    "trigger_word": "sax",
    "timeout": 2,
    "file": "c3c647dc-09ae-40dc-aa6d-1df960c0fce7.mp3",
    "name": "Epic sax",
    "volume": 0.4,
    "mod_only": 0,
    "sub_only": 0
}
```

### Exemple Request 3
```json
{
    "command":"tank",
    "param":"random",
    "excluded_tanks":[]
}
```

### Exemple Response 3
```json
{
    "response_type": "tank-random",
    "value": "@username Next tank : E100",
    "exclude": 3,
    "total": 2,
    "mod_only": 0,
    "sub_only": 0
}
```

### Exemple Request 4
```json
{
    "command":"tts",
    "param":"Hello tchat"
}
```

### Exemple Response 4
```json
{
    "response_type": "tts",
    "tts_type": "user",
    "value": "@username said : Hello tchat", // TTS prefix added
    "mod_only": 0,
    "sub_only": 0
}
```