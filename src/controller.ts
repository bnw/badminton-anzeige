import * as Vue from "vue/dist/vue";
import {initial_data} from "./data";
import {get_sharedb_connection} from "./websocket_connection";


(async function () {
    const data: any = initial_data;
    data.is_loading = true;

    const app = new Vue({
        el: '#app',
        data: data,
        computed: {},
        methods: {
            change_score: function (team: string, change: 1 | -1) {
                this[team].score = Math.max(0, this[team].score + change);
            },
            hide_next_set: function () {
                return this.sets.length >= 2;
            },
            delete_set: function (index: number) {
                this.sets.splice(index, 1);
            },
            is_set_finished: function () {
                const max = Math.max(this.team_a.score, this.team_b.score);
                return max >= 21 && (Math.abs(this.team_a.score - this.team_b.score) >= 2 || max >= 30);
            },
            start_next_set: function () {
                this.sets.push({team_a: this.team_a.score, team_b: this.team_b.score});
                this.team_a.score = 0;
                this.team_b.score = 0;
            },
            switch_sides: function () {
                const old_name_a = this.team_a.name;
                const old_score_a = this.team_a.score;
                this.team_a.name = this.team_b.name;
                this.team_a.score = this.team_b.score;
                this.team_b.name = old_name_a;
                this.team_b.score = old_score_a;

                for (let set of this.sets) {
                    const old_score_a = set.team_a;
                    set.team_a = set.team_b;
                    set.team_b = old_score_a;
                }
            },
            new_game: function () {
                if (window.confirm("Alle Sätze löschen und Punkte auf null setzen?")) {
                    this.sets.splice(0);
                    this.team_a.score = 0;
                    this.team_b.score = 0;
                }
            }
        }
    });

    const connection = await get_sharedb_connection();
    app.is_loading = false;
    const doc = connection.get('data', 'data');
    doc.subscribe(update_data);
    doc.on('op', update_data);
    doc.on('error', function (err) {
        console.error(err);
        alert(err); //TODO
    });

    function update_data() {
        if (JSON.stringify(doc.data.data) == JSON.stringify(raw_data(app))) return;
        app.team_a = Object.assign({}, doc.data.data.team_a);
        app.team_b = Object.assign({}, doc.data.data.team_b);
        app.sets = doc.data.data.sets;
    }

    function raw_data(app: Vue) {
        const sets = [];
        for (const set of app.sets) {
            sets.push({team_a: set.team_a, team_b: set.team_b});
        }
        return {
            team_a: {
                score: app.team_a.score,
                name: app.team_a.name
            },
            team_b: {
                score: app.team_b.score,
                name: app.team_b.name
            },
            sets: sets
        }
    }

    app.$watch(function () {
        return raw_data(this);
    }, function (data) {
        doc.submitOp([{p: ['data'], od: true, oi: data}]);
    }, {deep: true});

})();