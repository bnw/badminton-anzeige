import * as http from "http";
import * as ShareDB from "sharedb";
import * as connect from "connect";
import * as serveStatic from "serve-static";
import * as WebSocket from "ws";
import * as ShareDBMingoMemory from "sharedb-mingo-memory";
import * as WebSocketJSONStream from "websocket-json-stream";
import {initial_data} from "./data";

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

const port = process.argv[2] || 80;

// Create initial documents
async function main() {
    const connection = share.connect();
    const doc = connection.get('data', 'data');
    const err = await doc.fetch();
    if (err) throw err;
    await doc.create({data: initial_data});

    console.log("Listening on http://localhost:" + port);
    server.listen(port);
}

main();