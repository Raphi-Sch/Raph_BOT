# Moderator

## List

### Query 
```
Method : GET
URL : http://<web_server>/api/reations.php?list
```

### Response body
Field | Type | Description
---|---|---
id | Integer | ID in database
trigger_word | String | Word that triggeres the reaction
reaction | String | Reaction to that word
frequency | Integer | Frequency of reaction between 0 and 100
timeout | Integer | Timeout in seconds 

### Exemple response
```json
[
    {
        "id": 1,
        "trigger_word": "aaa",
        "reaction": "Reac1",
        "frequency": 95,
        "timeout": 5
    }
]
```

## Request

This module can react to specific word said in the chat.

If multiple word can triggered, the API choose one randomly.

With 'trigger_word' and 'timeout' you can make an exclusion list on your end, and send it back to the API for the next message.

### Query 
```
Method : POST
URL : http://<web_server>/api/reations.php?request
```
### Request query parameters
Field | Type | Required | Description
---|---|---|---
message | Array / String | Yes | Message to check for reaction
exclusion | Array / String | No | Word that are currently excluded

### Response body
Field | Type | Description
---|---|---
trigger_word | String | Word that trigger the moderator action
reaction | String | Reaction to the trigger word
frequency | Interger | Frequency of reaction between 0 and 100
timeout | Integer | Timeout in seconds

### Exemple request (string)
```json
{
    "message": "This is a test message"
}
```

### Exemple request (array)
```json
{
    "message": ["This", "is", "a", "test", "message"],
    "exclusion": "message"
}
```

### Exemple response
```json
{
    "trigger_word": "test",
    "reaction": "Test ?! This is a test ?!",
    "frequency": 50,
    "timeout": 30
}
```
