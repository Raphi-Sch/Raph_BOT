# Shout

## List

### Query 
```
Method : GET
URL : http://<web_server>/api/shout.php?list
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
original | String | Original word
replacement | String | Replacement for the original word
language | String | Language that apply (fr or fr-uwu)
type | Integer | Type of word (0 : Word, 1 : Consonant, 2 : Vowel)


### Exemple response
```json
[
    {
        "id": 1,
        "original": "ai",
        "replacement": "as",
        "language": "fr",
        "type": 0
    }
]
```

## Request

### Query 
```
Method : POST
URL : http://<web_server>/api/shout.php?request
```

### Headers
Name | Value
--- | ----
Authorization |  Bearer YOUR_TOKEN
Client | CLIENT_ID

### Request query parameters
Field | Type | Required | Description
---|---|---|---
message |  String | Yes | Message to apply shout
language | String | Yes | Language to apply (fr or fr-uwu)

### Response body
Field | Type | Description
---|---|---
value | String | Message to send on the chat

### Exemple request
```json
{
    "language": "fr",
    "message": "Je test le shout"
}
```

### Exemple response
```json
{
    "value" : "AH OUAIS @username, TU TEST LE SHOUT !"
}
```
