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
Unregisters a user and thereby removes all imformation belonging to that user (user data, tours and webhooks).   

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

Status codes: 200, 401, 404   

## PATCH /api/v1/user/:id
Partially updates information about a specific user.   

Parameters:   
| key | value |
|---|---|
| username | string |
| password | string |   

Authorization: Bearer Token   

Status codes: 200, 401, 403, 404

## PUT /api/v1/user/:id
Replaces information about a specific user.   

Parameters:   
| key | value |
|---|---|
| username | string |
| password | string |   

Authorization: Bearer Token   

Status codes: 200, 401, 403, 404

## GET /api/v1/user/:id/tour
Gets information about all tours of a specific user.   

Queries:   
| key | value |
|---|---|
| page-size | integer > 0 |
| page-start-index | integer >= 0 |   

Authorization: Bearer Token   

Status codes: 200, 401, 404

## POST /api/v1/user/:id/tour
Creates a new ski tour of the specific user.   

Parameters:   
| key | value |
|---|---|
| date | string (date in ISO format) |
| duration | number |
| distance | number |
| temperature | number |
| wax | string |
| grip | number (1, 2, 3, 4 or 5) |
| glide | number (1, 2, 3, 4 or 5) |
| description | string |   

Authorization: Bearer Token   

Status codes: 201, 400, 401, 403

## GET /api/v1/user/:id/tour/:id
Gets information about a specific tour of a specific user.   

Authorization: Bearer Token   

Status codes: 200, 401, 404

## PATCH /api/v1/user/:id/tour/:id
Partially updates the information about a specific tour.   

Parameters:   
| key | value |
|---|---|
| date | string (date in ISO format) |
| duration | number |
| distance | number |
| temperature | number |
| wax | string |
| grip | number (1, 2, 3, 4 or 5) |
| glide | number (1, 2, 3, 4 or 5) |
| description | string |   

Authorization: Bearer Token   

Status codes: 200, 401, 403, 404

## PUT /api/v1/user/:id/tour/:id
Replaces all information about a specific tour.   

Parameters:   
| key | value |
|---|---|
| date | string (date in ISO format) |
| duration | number |
| distance | number |
| temperature | number |
| wax | string |
| grip | number (1, 2, 3, 4 or 5) |
| glide | number (1, 2, 3, 4 or 5) |
| description | string |   

Authorization: Bearer Token   

Status codes: 200, 401, 403, 404

## DELETE /api/v1/user/:id/tour/:id
Removes a specific tour.   

Authorization: Bearer Token   

Status codes: 200, 401, 403, 404

## GET /api/v1/users/:id/webhook
Gets information about all webhooks of a specific user.   

Authorization: Bearer Token   

Status codes: 200, 401, 403, 404

## POST /api/v1/users/:id/webhook
Creates a new webhook of a specific user.   

Parameters:   
| key | value |
|---|---|
| endpoint | string (url) |
| token | string |
| user | boolean |
| tour | boolean |   

Authorization: Bearer Token   

Status codes: 201, 400, 401, 403, 404

## GET /api/v1/user/:id/webhook/:id
Gets information about a specific webhook of a specific user.   

Authorization: Bearer Token   

Status codes: 200, 400, 401, 403, 404

## PATCH /api/v1/user/:id/webhook/:id
Partially updates the information about a specific webhook.   

Parameters:   
| key | value |
|---|---|
| endpoint | string (url) |
| token | string |
| user | boolean |
| tour | boolean |   

Authorization: Bearer Token   

Status codes: 200, 400, 401, 403, 404

## PUT /api/v1/user/:id/webhook/:id
Replaces all information about a specific webhook.   

Parameters:   
| key | value |
|---|---|
| endpoint | string (url) |
| token | string |
| user | boolean |
| tour | boolean |   

Authorization: Bearer Token   

Status codes: 200, 400, 401, 403, 404

## DELETE /api/v1/user/:id/webhook/:id
Removes a specific webhook.   

Authorization: Bearer Token   

Status codes: 200, 400, 401, 403, 404