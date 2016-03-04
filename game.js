var map; // 2d array of references to rooms (which themselves are 2d arrays)
var currentRoom;

// Player Controls
var movingL = false;
var movingR = false;
var movingU = false;
var movingD = false;

// World Stuff
var wall = {char: 'W'};
var player = new player();

window.onload = function() {
  window.onkeydown = getKeysDown;
  window.onkeyup = getKeysUp;
  currentRoom = generateRoom();
  addPlayerToRoom();
  setInterval(function() {  // main game loop
    updatePlayer();
    drawRoom();
  }, 75);
}

function generateRoom() {
  var width = 60;
  var height = 20;
  var room = new Array(height);
  // generate arrays
  for (var i = 0; i < room.length; i++) {
    room[i] = new Array(width);
    room[i][0] = wall;
    room[i][room[i].length - 1] = wall;
  }
  for (var i = 0; i < room[0].length; i++) {
    room[0][i] = wall;
    room[room.length - 1][i] = wall;
  }

  return room;
}

function addPlayerToRoom() {
  player.row = 3;
  player.col = 5;
  currentRoom[player.row][player.col] = player;
}

function drawRoom() {
  var pre = qs("body pre");
  var str = "";
  for (var i = 0; i < currentRoom.length; i++) {
    for (var j = 0; j < currentRoom[i].length; j++) {
      str += currentRoom[i][j] == null ? ' ' : currentRoom[i][j].char;
    }
    str += "\n";
  }
  pre.innerHTML = str;
}

function updatePlayer() {
  var rowDiff = (movingU ? -1 : 0) + (movingD ? 1 : 0);
  var colDiff = (movingL ? -1 : 0) + (movingR ? 1 : 0);
  if (rowDiff != 0 || colDiff != 0) {
    currentRoom[player.row][player.col] = null;
    if (currentRoom[player.row + rowDiff][player.col + colDiff] == null) { // moving diagonally
      player.row += rowDiff;
      player.col += colDiff;
    } else if (currentRoom[player.row + rowDiff][player.col] == null) { // move vertical
      player.row += rowDiff;
    } else if (currentRoom[player.row][player.col + colDiff] == null) { // move horizontal
      player.col += colDiff;
    }
    currentRoom[player.row][player.col] = player;
  }
}

function getKeysDown(e) {
  getKeyToggle(e.keyCode, true);
}
function getKeysUp(e) {
  getKeyToggle(e.keyCode, false);
}
function getKeyToggle(key, val) {
  if (key == 65) movingL = val;
  else if (key == 68) movingR = val;
  else if (key == 87) movingU = val;
  else if (key == 83) movingD = val;
}

function qs(selector) {
  return document.querySelector(selector);
}

function player() {
  this.char = '$';
}

function enemy() {
  this.char = "X";
}
