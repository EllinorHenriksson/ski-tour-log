# Ski Tour Log API - Documentation
## GET /api/v1
Gets entry links for the API.   

## POST /api/v1/user/register
Registers a user.

Parameters:   
| key | value |
|---|---|
| username | string |
| password | string |
   
Status codes: 201, 400, 409

## POST /api/v1/user/login
Authenticates a user and returns an access token that is used in the Authorization header as Bearer Token type in subsequent requests.

Parameters:   
| key | value |
|---|---|
| username | string |
| password | string |
   
Status codes: 200, 401

## POST /api/v1/user/unregister
Unregisters a user.

Authorization: Bearer Token

Status codes: 200, 401

## GET /api/v1/user
Gets information about all users.   

Queries:   
| key | value |
|---|---|
| page-size | integer > 0 |
| page-start-index | integer >= 0 |   

Authorization: Bearer Token

Status codes: 200, 401

## GET /api/v1/user/:id
Gets information about a specific user.

Authorization: Bearer Token

Status codes: 200, 401

## PATCH /api/v1/user/:id
Partially updates information about a specific user.

Parameters:   
| key | value |
|---|---|
| username | string |
| password | string |

Authorization: Bearer Token

Status codes: 200, 401, 403

## PUT /api/v1/user/:id
Replaces information about a specific user.

Parameters:   
| key | value |
|---|---|
| username | string |
| password | string |

Authorization: Bearer Token

Status codes: 200, 401, 403

## 