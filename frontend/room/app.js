//add the socket connection on load of the page

let socket = io("/room");
let playerNumber = 0;
let secondPlayer = 0;

window.addEventListener("load", () => {
  socket.on("connect", () => {
    socket.on("roomEnded", () => {
      let loc = String(window.location.href);
      window.location.href = loc.slice(0, loc.indexOf("room"));
      //one of the players disconnected, therefore, the game ended and now we need to get out of the room
    });
    roomNumber = sessionStorage.getItem("room");
    socket.emit("room", { room: roomNumber });
    socket.on("playerConnected", (data) => {
      data.connected === 1 ? (playerNumber = 0) : (playerNumber = 1);
      data.connected === 1 ? (secondPlayer = 1) : (secondPlayer = 0);
      console.log(data);
    });
  });
});

//to work with bigger dimesnions and other computers
const maxVelocity = 20;
const wid = 1440;
const hei = 770;

const dimension = {
  blockSize: 1440 / map1[0].length,
  ground: (1440 / map1[0].length) * (map1.length - 4),
  playerSize: 50,
};

//defining all of the variables

let game;

let character2right;
let character2left;
let character1right;
let character1left;
let charactersLefts = [character1left, character2left];
let charactersRights = [character1right, character2right];

let texture;

let door_top;
let door_bottom;
let doorParts = [door_top, door_bottom];

let keyImage;

let backGround;

function preload() {
  charactersLefts[1] = loadImage("/room/images/character2_left.png");
  charactersRights[1] = loadImage("/room/images/character2_right.png");
  charactersLefts[0] = loadImage("/room/images/character1_left.png");
  charactersRights[0] = loadImage("/room/images/character1_right.png");

  doorParts[0] = loadImage("/room/images/door_upper.png");
  doorParts[1] = loadImage("/room/images/door_lower.png");

  texture = loadImage("/room/images/texture.png");

  keyImage = loadImage("/room/images/key.png");

  backGround = loadImage("/room/images/background.png");
}

socket.on("heartbeat", (players) => game && updatePlayers(players));

function updatePlayers(players) {
  game.players[0].position = players.player1.pos;
  game.players[0].facing = players.player1.facing;
  game.players[1].position = players.player2.pos;
  game.players[1].facing = players.player2.facing;
  game.key = players.key;

  // game.players[secondPlayer].position.x = players[secondPlayer].x;
  // game.players[secondPlayer].position.y = players[secondPlayer].y;
  // if (game.players[secondPlayer].ground !== players[secondPlayer].ground)
  //     game.players[secondPlayer].ground = players[secondPlayer].ground;
  //   if (game.players[secondPlayer].facing !== players[secondPlayer].facing)
  //     game.players[secondPlayer].facing = players[secondPlayer].facing;
}

function setup() {
  createCanvas(wid, hei);
  console.log(dimension);
  game = new Game(height, width, map1, dimension);
  socket.on("heartbeat", (players) => game && updatePlayers(players));
  socket.on("roomEnded", () => {
    let loc = String(window.location.href);
    console.log(loc);
    console.log(loc.slice(0, loc.indexOf("room")));
    window.location.href = loc.slice(0, loc.indexOf("room"));
    //one of the players disconnected, therefore, the game ended and now we need to get out of the room
  });
  socket.on("disconnect", () => {
    let loc = String(window.location.href);
    console.log(loc);
    console.log(loc.slice(0, loc.indexOf("room")));
    window.location.href = loc.slice(0, loc.indexOf("room"));
  });
}

function draw() {
  image(backGround, 0, 0, wid, hei);
  // background(0);
  game.display();

  // let data = {
  //   player: playerNumber,
  //   x: game.players[playerNumber].position.x,
  //   y: game.players[playerNumber].position.y,
  //   ground: game.players[playerNumber].ground,
  //   facing: game.players[playerNumber].facing,
  // };

  // socket.emit("position", data);
}
