var map; // 2d array of references to rooms (which themselves are 2d arrays)
var currentRoom;

// Player Controls
var movingL;
var movingR;
var movingU;
var movingD;

// World Stuff
var wall = {char: 'W'};

window.onload = function() {
  window.onkeydown = getKeysDown;
  window.onkeyup = getKeysDown;
  currentRoom = generateRoom();
  setInterval(function() {  // main game loop
    updatePlayer();
    drawRoom();
  }, 100);
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

}

function getKeysDown(e) {
  movingL = e.keycode == 65;
  movingR = e.keyCode == 68;
  movingU = e.keyCode == 87;
  movingD = e.keyCode == 83;
}

function qs(selector) {
  return document.querySelector(selector);
}
