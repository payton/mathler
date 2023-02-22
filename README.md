# Mathler x Windows 98 x Dynamic

My version of Mathler is styled to look like a Windows 98 desktop game with a built-in leaderboard to compete against other authenticated users. Each user authenticates with Dynamic and is then presented with a randomly selected game. If the user completes the game, their global score is incremented and displayed along with their wallet address.

## REST API
* POST /session
    * Creates a new session if the authenticated user does not have one (otherwise returns an existing session).
    * Status Codes
        * 200: Session exists or session created
        * 401: User not authorized
* PUT /session/:sessionId
    * Updates an existing session (identified by sessionId) with the proposed board state (body must contain a board attribute).
    * Status Codes
        * 200: Update attempt was successful (this may "fail" and return a user-friendly error message... non 4xx is returned to simplify axios configuration for takehome)
        * 400: Invalid body or querystring
        * 401: User not authorized
* GET /session/:sessionId
    * Gets an existing session (identified by sessionId).
    * Status Codes
        * 200: Session was found
        * 400: Invalid querystring
        * 401: User not authorized
        * 404: Session not found
* GET /leaderboard
    * Gets current leaderboard (top 10 players).
    * Status Codes
        * 200: Successfully aggregated leaderboard

## Tests
Tests have been written for the utils directory, which contains core business logic for the game. Due to time constraints, I've omitted further tests a layer "up" in the integration realm.