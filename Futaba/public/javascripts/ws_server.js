var { WebSocketServer } = require('ws')

var sqlite3 = require("sqlite3");
var db = new sqlite3.Database("sqlite3.db");

let rooms = {};

const wss = new WebSocketServer({ port: 4001 });

wss.on('connection', function connection(ws) {
    ws.on('message', function message(data) {
        ws.send('hello from server!')
        const obj = JSON.parse(data);
        const type = obj.type;
        const params = obj.params;

        console.log(obj)

        switch (type) {
            case "join":
                join_room(params);
                break;
            case "message":
                send_message(params);
                break;
            default:
                console.warn(`Type: ${type} unknown`);
                break;
        }
    });

    function join_room(params) {
        // exit current room
        if ("room" in ws) {
            const room = ws.room
            rooms[room] = rooms[room].filter(so => so !== ws);
        }
        // join new room
        const room = params.customer_id
        if (room in rooms) {
            rooms[room].push(ws);
        } else {
            rooms[room] = [ws];
        }
        ws["room"] = room;
    }

    function send_message(params) {
        // broadcast message to all user in the room
        const room = ws.room.filter(so => so !== ws);
        room.forEach(cl => cl.send(params.message));

        // save message in database
    }
});