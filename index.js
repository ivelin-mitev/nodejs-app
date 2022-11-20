const express = require("express");
const socket = require("socket.io");
const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function (req, res, next) {
  // Handle the get for this route
});

app.post('/', function (req, res, next) {
  // Handle the post for this route
});

const server = app.listen(3000, function () {
  console.log("server running on port 3000");
});

const io = socket(server, {
  allowEIO3: true,
  cors: { credentials: true, origin: 'http://localhost:3000' },
});

let game = {};

io.on("connection", function (socket) {

  // If a player joins from URL invitation
  socket.on("invitedPlayerLoading", function (roomId) {
    const ROOMID = roomId;
    socket.emit('playerHasInvitation', true);
    socket.emit('newPlayerId', game[ROOMID].players.length);
  })

  // If a player doesn't have invitation URL
  socket.on("initialPlayer", function () {
    socket.emit('playerHasInvitation', false);
    // On connection a room ID is created
    const currentRoomId = socket.id.substr(0, 6);
    // We emit the room and add it to the route as query
    // so the url can be copied and shared for other players
    io.emit('roomId', currentRoomId);
    // io.emit('set_player_id', game.players.length);

    // On clicking the play button, a waiting room is initialized
    // and the ID becomes the "key" in the game object, while the value
    // will be all the information about the current instance of the game as
    // players, roles of players, question, winner.
    socket.on("initialize_waiting_room", function (data) {
      game[currentRoomId] = {
        players: [],
        phase: 'waiting',
        winner: undefined,
        strawsDrown: 0
      }
      game[currentRoomId].players.push(data);
      console.log(game[currentRoomId].players.length);
    })

  })

  // Basic tests
  console.log('connected ' + socket.id);
  socket.on("disconnect", function () {
    console.log('disconnect');
  })
});