# Mathler x Windows 98 x Dynamic

My version of Mathler is styled to look like a Windows 98 desktop game with a built-in leaderboard to compete against other authenticated users. Each user authenticates with Dynamic and is then presented with a randomly selected game. If the user completes the game, their global score is incremented and displayed along with their wallet address.

## REST API
* POST /session
    * Creates a new session if the authenticated user does not have one (otherwise returns an existing session).
    * Status Codes
        * 200: Session exists
        * 201: Session created
        * 401: User not authorized
* PUT /session/:sessionId
    * Updates an existing session (identified by sessionId) with the proposed board state (body must contain a board attribute).
    * Status Codes
        * 200: Update attempt was successful (this may "fail" and return a user-friendly error message... non 4xx is returned to simplify axios configuration for takehome)
        * 400: Invalid body or querystring
        * 401: User not authorized
        * 405: Invalid method
* GET /session/:sessionId
    * Gets an existing session (identified by sessionId).
    * Status Codes
        * 200: Session was found
        * 400: Invalid querystring
        * 401: User not authorized
        * 404: Session not found
        * 405: Invalid method
* GET /leaderboard
    * Gets current leaderboard (top 10 players).
    * Status Codes
        * 200: Successfully aggregated leaderboard

## Configuration
A `app/.env` file is included in this repository for simplicity. This is for running a development server and integration tests.

## Tests
Tests are split up into unit and integration tests. Unit tests test the core business logic of Mathler. Integration tests test request flows with a local database to assert status codes and response formatting.

## Usage

Note: integration, test, and dev targets will spin up a local docker container with postgres and store postgres data in a `./pg-data` directory.

To run integration tests, run:
```
make integration
```


To run unit tests, run:
```
make unit
```

To run all tests, run:
```
make test
```

Finally, to run this version of mathler locally, run:
```
make dev
```
You will be able to access the local development server at `http://localhost:3000`.