import * as Vue from "vue/dist/vue";
import {initial_data} from "./data";
import {get_sharedb_connection} from "./websocket_connection";

(async function () {
    const data: any = initial_data;
    data.is_loading = true;

    const app = new Vue({
        el: '#app',
        data: data,
        computed: {}
    });

    const connection = await get_sharedb_connection();
    app.is_loading = false;

    const doc = connection.get('data', 'data');
    doc.subscribe(update_data);
    doc.on('op', update_data);

    function update_data() {
        app.team_a = Object.assign({}, doc.data.data.team_a);
        app.team_b = Object.assign({}, doc.data.data.team_b);
        app.sets = Object.assign(doc.data.data.sets);
        console.log(doc.data);
    }
})();

