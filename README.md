# collective-playingaround

Collective Playingaround is a multiplayer drawing experience made by the utilization of websockets and the html canvas.

## Running the game
1. Clone the repo
2. Install dependencies `npm install`
3. Run the server, `npm run start`
4. Open the client, `https://localhost:8000`

## How to Play
1. All players open `BASE_URL/player`
2. After every players are connected, the first player will be given a prompt to draw
3. Players have a limited amount of "ink" to draw with
4. Players take turn drawing based on the communal prompt. After the first player draws, the subsequent player will be instructed to draw, so on and so forth
5. If the current drawer feels like they are happy with the drawing, they can opt to end the drawing and the experience will be over

## Communications Mechanics
This diagram describes the client-server communications


![alt text](https://raw.githubusercontent.com/tirtawr/collective-playingaround/master/mechanics-diagram.png "Mechanics diagram")
