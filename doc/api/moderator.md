# Moderator

## List

### Query 
```
Method : GET
URL : http://<web_server>/api/moderator.php?list
```

### Headers
Name | Value
--- | ----
Authorization |  Bearer YOUR_TOKEN
Client | CLIENT_ID

### Response body
Field | Type | Description
---|---|---
id | Integer | ID in database
trigger_word | String | Word that triggeres the ban / timeout
mod_action | Integer | 0 : Ban, 1 : Timeout, 2 : Delete message
duration | Integer | Duration of the timeout in seconds (always 0 for ban)
explanation | String | Explanation send to chat
reason | String | Reason send to user only

### Exemple response
```json
[
    {
        "id": 1,
        "trigger_word": "test",
        "mod_action": 0,
        "duration": 0,
        "explanation": "This user was ban",
        "reason": "You were ban because you said 'test'"
    }
]
```

## Request

### Query 
```
Method : POST
URL : http://<web_server>/api/moderator.php?request
```

### Headers
Name | Value
--- | ----
Authorization |  Bearer YOUR_TOKEN
Client | CLIENT_ID

### Request query parameters
Field | Type | Required | Description
---|---|---|---
message | Array / String | Yes | Message to check by the moderator

### Response body
Field | Type | Description
---|---|---
trigger_word | String | Word that trigger the moderator action
mod_action | Boolean | 0 : Ban, 1 : Timeout
duration | Integer | Duration of the timeout in seconds (always 0 for ban)
explanation | String | Explanation send to chat
reason | String | Reason send to user only

### Exemple request (string)
```json
{
    "message": "This is a test message"
}
```

### Exemple request (array)
```json
{
    "message": ["This", "is", "a", "test", "message"]
}
```

### Exemple response
```json
{
    "trigger_word": "test",
    "mod_action": 1,
    "duration": 10,
    "explanation": "This user was ban",
    "reason": "You were ban because you said 'test'"
}
```
