var map; // 2d array of references to rooms (which themselves are 2d arrays)
var currentRoom;

// Player Controls
var movingL = false;
var movingR = false;
var movingU = false;
var movingD = false;

// World Stuff
var wall = {char: 'W'};
var player = {char: "$"};
var projectile = {char: "o"};

window.onload = function() {
  window.onkeydown = getKeysDown;
  window.onkeyup = getKeysUp;
  generateRooms();
  printMap();
  addPlayerToRoom();
  setInterval(function() {  // main game loop
    updatePlayer();
    drawRoom();
  }, 75);
}

// Generates the map of rooms
function generateRooms() {
  var width = 30;
  var height = 10;
  var minNumOfRooms = 100;
  var connectedRooms = [];
  while (connectedRooms.length < minNumOfRooms) {
    map = new Array(height);
    var allRooms = [];
    for (var i = 0; i < height; i++) {
      map[i] = new Array(width);
      for (var j = 0; j < map[i].length; j++) {
        if (Math.random() < 0.5) {
          map[i][j] = new room(i, j);
          allRooms.push(map[i][j]);
        }
      }
    }
    currentRoom = allRooms[randomInt(0, allRooms.length - 1)];
    connectedRooms = getConnectedRooms(currentRoom.row, currentRoom.col, new Array());
    for (var i = 0; i < allRooms.length; i++) {
      if (!connectedRooms.includes(allRooms[i])) {
        map[allRooms[i].row][allRooms[i].col] = null;
      }
    }
  }
  for (var i = 0; i < connectedRooms.length; i++) {
    connectedRooms[i].generateRoom();
  }
}

// Starting at a given room, recursively builds up the array of
// visiting rooms (arr) and return it
function getConnectedRooms(row, col, arr) {
  if (mapContains(row, col) && !arr.includes(map[row][col]) && map[row][col] != null) {
    arr.push(map[row][col]);
    getConnectedRooms(row + 1, col, arr);
    getConnectedRooms(row - 1, col, arr);
    getConnectedRooms(row, col + 1, arr);
    getConnectedRooms(row, col - 1, arr);
  }
  return arr;
}

// Genereates a single room object
function room(row, col) {
  this.width = randomInt(20, 80);
  this.height = randomInt(10, 30);
  this.row = row;
  this.col = col;
  this.arr = new Array(this.height);
  this.generateRoom = function() {
    var room = this.arr;
    for (var i = 0; i < room.length; i++) {
      room[i] = new Array(this.width);
      room[i][0] = wall;
      room[i][room[i].length - 1] = wall;
    }
    for (var i = 0; i < room[0].length; i++) {
      room[0][i] = wall;
      room[room.length - 1][i] = wall;
    }
  }
}

// Loads the room at the given indeces, if possible
function loadRoomAt(row, col) {
  if (mapContains(row, col) && map[row][col] != null) {
    currentRoom[player.row][player.col] = null;
    currentRoom = map[row][col];
    addPlayerToRoom();
    printMap();
  }
}

// Returns a random int in the range of [min, max]
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Returns true if the indeces are within the map's bounds
function mapContains(row, col) {
  return row >= 0 && row < map.length && col >= 0 && col < map[0].length;
}

// Prints the map of rooms, including showing current room
function printMap() {
  var str = "+";
  for (var i = 0; i < map[0].length; i++) {
    str +="="
  }
  str += "+\n";
  for (var i = 0; i < map.length; i++) {
    str += "|";
    for (var j = 0; j < map[i].length; j++) {
      if (map[i][j] == currentRoom) {
        str += 'O';
      } else if (map[i][j] != null) {
        str += '*';
      } else {
        str += ' ';
      }
    }
    str += "|\n";
  }
  str += "+";
  for (var i = 0; i < map[0].length; i++) {
    str +="="
  }
  str += "+\n";
  id("map").innerHTML = str;
}

// Sticks the player in a room (at the moment, the location is fixed)
function addPlayerToRoom() {
  player.row = 3;
  player.col = 5;
  currentRoom.arr[player.row][player.col] = player;
}

// Prints the room on the page (needs to be called to see anything happen)
function drawRoom() {
  var pre = id("game-area");
  var str = "";
  for (var i = 0; i < currentRoom.arr.length; i++) {
    for (var j = 0; j < currentRoom.arr[i].length; j++) {
      str += currentRoom.arr[i][j] == null ? ' ' : currentRoom.arr[i][j].char;
    }
    str += "\n";
  }
  pre.innerHTML = str;
}

// Moves the player if input is being given
function updatePlayer() {
  var rowDiff = (movingU ? -1 : 0) + (movingD ? 1 : 0);
  var colDiff = (movingL ? -1 : 0) + (movingR ? 1 : 0);
  if (rowDiff != 0 || colDiff != 0) {
    currentRoom.arr[player.row][player.col] = null;
    if (canStandAt(currentRoom.arr[player.row + rowDiff][player.col + colDiff])) { // moving diagonally
      player.row += rowDiff;
      player.col += colDiff;
    } else if (canStandAt(currentRoom.arr[player.row + rowDiff][player.col])) { // move vertical
      player.row += rowDiff;
    } else if (canStandAt(currentRoom.arr[player.row][player.col + colDiff])) { // move horizontal
      player.col += colDiff;
    }
    currentRoom.arr[player.row][player.col] = player;
  }
}

// Makes sure the player isn't hitting a wall
function canStandAt(loc) {
  return loc != wall;
}

// Listener functions for keypresses
function getKeysDown(e) {
  getKeyToggle(e.keyCode, true);
}
function getKeysUp(e) {
  getKeyToggle(e.keyCode, false);
}
function getKeyToggle(key, val) {
  // WASD
  if (key == 65) movingL = val;
  else if (key == 68) movingR = val;
  else if (key == 87) movingU = val;
  else if (key == 83) movingD = val;

  // IJKL
  if (key == 73) loadRoomAt(currentRoom.row - 1, currentRoom.col);
  else if (key == 74) loadRoomAt(currentRoom.row, currentRoom.col - 1);
  else if (key == 75) loadRoomAt(currentRoom.row + 1, currentRoom.col);
  else if (key == 76) loadRoomAt(currentRoom.row, currentRoom.col + 1);
}

// Shorthand because I'm lazy
function id(selector) {
  return document.getElementById(selector);
}
