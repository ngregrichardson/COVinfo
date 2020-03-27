const express = require('express');
const http = require('http');
const cors = require('cors');
const socket = require('socket.io');
const path = require('path');

const port = process.env.PORT || 4000;
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);

const io = socket(server);

app.get('/', (req, res) => {
    res.send({ response: "I am alive" }).status(200);
});

app.post('/sendMessage', (req, res) => {
    console.log(req.query);
    let params = req.query;
    if(!params.username || !params.message || !params.username_color) {
        return res.send({statusCode: 401, message: 'Bad params.'}).status(401);
    }
    io.emit('message', params);
    res.send({statusCode: 200, message: 'Sent.'}).status(200);
});

io.on('connection', socket => {
    console.log('someone connected!');
});

server.listen(port, () => console.log(`Listening on port ${port}`));
