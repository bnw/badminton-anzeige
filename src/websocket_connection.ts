import * as sharedb from 'sharedb/lib/client/index';

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Expose a singleton WebSocket connection to ShareDB server
export function get_sharedb_connection() {
    return new Promise<sharedb.Connection>(resolve => {
        const server = location.host || 'localhost:8080';
        const socket = new WebSocket('ws://' + server);
        let has_been_open: boolean = false;
        socket.onerror = function (event) {
            if (!has_been_open) {
                delay(1000).then(() => {
                    get_sharedb_connection().then(resolve);
                });
            } else {
                alert("Verbindung abgebrochen. Lade neu!");
                window.location.reload();
            }
        };
        socket.onopen = function (event) {
            has_been_open = true;
            resolve(new sharedb.Connection(socket));
        };
    });
}