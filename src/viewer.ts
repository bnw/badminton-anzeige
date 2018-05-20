import * as Vue from "vue/dist/vue";
import {Data} from "./data";
import * as sharedb from 'sharedb/lib/client/index';


const data: Data = {
    team_a: {score: 0, name: "Gast"},
    team_b: {score: 0, name: "Heim"},
    sets: [{team_a: 1, team_b: 21}]
};

const app = new Vue({
    el: '#app',
    data: data,
    computed: {}
});


// Expose a singleton WebSocket connection to ShareDB server
const socket = new WebSocket('ws://' + window.location.host);
const connection = new sharedb.Connection(socket);
module.exports = connection;

const doc = connection.get('data', 'data');
doc.subscribe(update_data);
doc.on('op', update_data);

function update_data() {
    app.team_a = Object.assign({}, doc.data.data.team_a);
    app.team_b = Object.assign({}, doc.data.data.team_b);
    app.sets = Object.assign(doc.data.data.sets);
    console.log(doc.data);
}


// setTimeout(() => {
//     doc.submitOp([{p: ['team_a'], od: true, oi: {score: 5, sets: [21, 21], name: "Team B old"}}]);
//     // {p:[path,idx], ld:before, li:after}
//     // doc.data.team_a.score++; console.log(doc.data.team_a.score)
// }, 1000);
