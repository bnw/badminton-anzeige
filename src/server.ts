import * as http from "http";
import * as ShareDB from "sharedb";
import * as connect from "connect";
import * as serveStatic from "serve-static";
import * as WebSocket from "ws";
import * as ShareDBMingoMemory from "sharedb-mingo-memory";
import * as WebSocketJSONStream from "websocket-json-stream";
import {Data} from "./data";

// Start ShareDB
const share = ShareDB({db: new ShareDBMingoMemory()});

// Create a WebSocket server
const app = connect();
app.use(serveStatic('.'));
const server = http.createServer(app);
const wss = new WebSocket.Server({server: server});

// Connect any incoming WebSocket connection with ShareDB
wss.on('connection', function (ws, req) {
    const stream = new WebSocketJSONStream(ws);
    share.listen(stream);
});

// Create initial documents
async function main() {
    const connection = share.connect();
    const doc = connection.get('data', 'data');
    const err = await doc.fetch();
    if (err) throw err;
    const data: Data = {
        team_a: {score: 20, name: "Team A"},
        team_b: {score: 5, name: "Team B"},
        sets: [{team_a: 21, team_b: 12}, {team_a: 6, team_b: 21}]
    };
    await doc.create({data: data});

    console.log("Listening on http://localhost:80");
    server.listen(80);
}

main();