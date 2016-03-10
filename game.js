var map; // 2d array of references to rooms (which themselves are 2d arrays)
var currentRoom;

// Player State
var movingL = false;
var movingR = false;
var movingU = false;
var movingD = false;
var canShoot = true;
var coins = 0;

// World Stuff
var wall = {char: 'W', solid: true};
var player = {char: '$', solid: true};
var coin = {char: '¢'}

window.onload = function() {
  window.onkeydown = addKeyToKeyArray;
  window.onkeyup = removeKeyFromKeyArray;
  generateRooms();
  currentRoom.roomComplete();
  printSidebar();
  addPlayerToRoom();
  setInterval(function() {  // main game loop
    updatePlayer();
    keyCheck();
    currentRoom.updateEnemies();
    printRoom();
  }, 75);
}

// Generates the map of rooms
function generateRooms() {
  var width = 20;
  var height = 12;
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
  generateDoors(connectedRooms);

  /* Count the occurences of rooms with single doors */
  var count = 0;
  for (var i = 0; i < connectedRooms.length; i++) {
    if (connectedRooms[i].doors.length == 4) {
      currentRoom = connectedRooms[i];
      break;
    }
  }
  currentRoom.enemyFree = true;
}

function generateDoors(rooms) {
  for (var i = 0; i < rooms.length; i++) {
    if (rooms[i].topDoor == null &&
        mapContains(rooms[i].row - 1, rooms[i].col) &&
        map[rooms[i].row - 1][rooms[i].col] != null) {
        var otherRoom = map[rooms[i].row - 1][rooms[i].col];
        var d1 = rooms[i].addDoorAtRow(0);
        var d2 = otherRoom.addDoorAtRow(otherRoom.arr.length - 1);
        d1.opposite = d2;
        d2.opposite = d1;
    }
    if (rooms[i].bottomDoor == null &&
        mapContains(rooms[i].row + 1, rooms[i].col) &&
        map[rooms[i].row + 1][rooms[i].col] != null) {
        var otherRoom = map[rooms[i].row + 1][rooms[i].col];
        var d1 = rooms[i].addDoorAtRow(rooms[i].arr.length - 1);
        var d2 = otherRoom.addDoorAtRow(0);
        d1.opposite = d2;
        d2.opposite = d1;
    }
    if (rooms[i].leftDoor == null &&
        mapContains(rooms[i].row, rooms[i].col - 1) &&
        map[rooms[i].row][rooms[i].col - 1] != null) {
        var otherRoom = map[rooms[i].row][rooms[i].col - 1];
        var d1 = rooms[i].addDoorAtCol(0);
        var d2 = otherRoom.addDoorAtCol(otherRoom.arr[0].length - 1);
        d1.opposite = d2;
        d2.opposite = d1;
    }
    if (rooms[i].rightDoor == null &&
        mapContains(rooms[i].row, rooms[i].col + 1) &&
        map[rooms[i].row][rooms[i].col + 1] != null) {
        var otherRoom = map[rooms[i].row][rooms[i].col + 1];
        var d1 = rooms[i].addDoorAtCol(rooms[i].arr[0].length - 1);
        var d2 = otherRoom.addDoorAtCol(0);
        d1.opposite = d2;
        d2.opposite = d1;
    }
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

// Constructor for a room object. generateRoom() needs to be called
// to actually build all the rooms.
function room(row, col) {
  this.width = randomInt(20, 50);
  this.height = randomInt(10, 30);
  this.completed = false;
  this.row = row;
  this.col = col;
  this.arr = new Array(this.height);
  this.items = new Array(this.height);
  this.generateRoom = function() {
    var room = this.arr;
    for (var i = 0; i < room.length; i++) {
      room[i] = new Array(this.width);
      room[i][0] = wall;
      room[i][room[i].length - 1] = wall;
      this.items[i] = new Array(this.width);
    }
    for (var i = 0; i < room[0].length; i++) {
      room[0][i] = wall;
      room[room.length - 1][i] = wall;
    }
  }
  this.doors = [];
  this.bottomDoor = null;
  this.topDoor = null;
  this.leftDoor = null;
  this.rightDoor = null;
  this.enemies = [];

  // adds a door on the given row (should be top or bottom)
  this.addDoorAtRow = function(row) {
    var doorMid = randomInt(3, this.arr[0].length - 4);
    var d = new door(this, [row, doorMid, row, doorMid + 1, row, doorMid - 1]);
    this.doors.push(d);
    if (row == 0) this.topDoor = d;
    else this.bottomDoor = d;
    return d;
  }

  // adds a door on the given col (should be furthest left or right)
  this.addDoorAtCol = function(col) {
    var doorMid = randomInt(3, this.arr.length - 4);
    var d = new door(this, [doorMid, col, doorMid + 1, col, doorMid - 1, col]);
    this.doors.push(d);
    if (col == 0) this.leftDoor = d;
    else this.rightDoor = d;
    return d;
  }

  // marks the room as complete, opens all doors that don't require a key
  // (keys aren't implemented yet, so currently opens all doors)
  this.roomComplete = function() {
    this.completed = true;
    for (var i = 0; i < this.doors.length; i++) {
      this.doors[i].open();
    }
  }

  // generates all the enemies for the room
  this.generateEnemies = function() {
    this.enemiesHaveBeenSpawned = true;
    for (var i = 0; i < 5; i++) {
      var enemyRow = randomInt(2, this.height - 3);
      var enemyCol = randomInt(2, this.width - 3);
      while (this.arr[enemyRow][enemyCol] != null) {
        enemyRow = randomInt(2, this.height - 3);
        enemyCol = randomInt(2, this.width - 3);
      }
      var enemy = new zombie(this, enemyRow, enemyCol);
      this.enemies.push(enemy);
      this.arr[enemyRow][enemyCol] = enemy;
    }
  }

  this.updateEnemies = function() {
    for (var i = 0; i < this.enemies.length; i++) {
      if (this.enemies[i].dead || !roomContains(this.enemies[i].row, this.enemies[i].col, this)) {
        this.enemies.splice(i, 1);
        i--;
      } else {
        this.enemies[i].move();
      }
    }
    if (this.enemies.length == 0) {
      this.roomComplete();
    }
  }
}

// Constructor for a basic zombie enemy that walks towards
// the player and tries to hurt them
function zombie(room, row, col) {
  this.room = room;
  this.row = row;
  this.col = col;
  this.char = "Z";
  this.solid = true;
  this.health = 2;
  this.moveStep = 0;

  // applies damage to the enemy
  this.damage = function() {
    this.health--;
    if (this.health <= 0) {
      this.die();
    }
  }

  // makes the enemy die
  this.die = function() {
    this.dead = true;
    this.room.arr[this.row][this.col] = null;
    if (Math.random() > 0.5) {
      dropItem(coin, this.room, this.row, this.col)
    }
  }

  // makes the enemy make a single move
  this.move = function() {
    this.moveStep++;
    if (this.moveStep % 2 == 0 && canStandAt(this.room.arr[this.row][this.col - 1])) {
      this.room.arr[this.row][this.col] = null;
      this.col--;
      this.room.arr[this.row][this.col] = this;
    }
  }
}

// Drops an item in the given room
function dropItem(item, room, row, col) {
  room.items[row][col] = item;
}

// Constructor for a door object. Takes an array of ints which represent the row and col
// of each location of the door (since doors can occupy multiple spaces)
function door(room, rowsAndCols) {
  this.solid = true;
  this.char = "D";
  this.locations = rowsAndCols;
  this.room = room;
  this.opened = false;
  for (var i = 0; i < rowsAndCols.length; i+=2) {
    room.arr[rowsAndCols[i]][rowsAndCols[i + 1]] = this;
  }
  // opens the door, takes the room it is currently in as a parameter
  this.open = function() {
    if (!this.opened) {
      this.opened = true;
      for (var i = 0; i < this.locations.length; i+=2) {
        room.arr[this.locations[i]][this.locations[i + 1]] = null;
      }
      if (this.opposite != null) {
        this.opposite.open();
      }
    }
  }
}

// Loads the room at the given indeces, if possible
function loadRoomAt(row, col, whichDoor) {
  if (mapContains(row, col) && map[row][col] != null) {
    currentRoom.arr[player.row][player.col] = null;
    currentRoom = map[row][col];
    addPlayerToRoom(whichDoor);
    if (!currentRoom.enemyFree && !currentRoom.enemiesHaveBeenSpawned) {
      currentRoom.generateEnemies();
    } else if (currentRoom.enemiesHaveBeenSpawned) {
      // we probably want to move around the enemies a bit
    }
    printSidebar();
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

// Returns true if the indeces are within a room's bound
// if no room is specified, looks at the currentRoom
function roomContains(row, col, room) {
  if (!room) {
    room = currentRoom;
  }
  return row >= 0 && row < room.arr.length && col >= 0 && col < room.arr[0].length;
}

// Prints the map of rooms, including showing current room
function printSidebar() {
  // Print the map
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
  str += "+\n\n";
  if (coins > 0) {
    str += coins + coin.char;
  }
  id("map").innerHTML = str;
}

// Sticks the player in a room (at the moment, the location is fixed)
function addPlayerToRoom(whichDoor) {
  if (whichDoor) {  // the player just walked in to a room, put them in the doorway
    var d = null;
    if (whichDoor == "left") d = currentRoom.leftDoor;
    else if (whichDoor == "right") d = currentRoom.rightDoor;
    else if (whichDoor == "top") d = currentRoom.topDoor;
    else d = currentRoom.bottomDoor;
    player.row = d.locations[0];
    player.col = d.locations[1];
  } else {  // stick them in the middle
    player.row = Math.floor(currentRoom.arr.length / 2);
    player.col = Math.floor(currentRoom.arr[0].length / 2);
  }
  currentRoom.arr[player.row][player.col] = player;
}

// Prints the room on the page (needs to be called to see anything happen)
function printRoom() {
  var pre = id("game-area");
  var str = "";
  for (var i = 0; i < currentRoom.arr.length; i++) {
    for (var j = 0; j < currentRoom.arr[i].length; j++) {
      if (i == player.row && j == player.col) {
        str += player.char;
      } else if (currentRoom.arr[i][j] != null) {
        str += currentRoom.arr[i][j].char;
      } else if (currentRoom.items[i][j] != null) {
        str += currentRoom.items[i][j].char;
      } else {
        str += ' ';
      }
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
    if (!loadNewRoomIfOutside(player.row + rowDiff, player.col + colDiff)) {
      if (canStandAt(currentRoom.arr[player.row + rowDiff][player.col + colDiff])) { // moving diagonally
        player.row += rowDiff;
        player.col += colDiff;
      } else if (canStandAt(currentRoom.arr[player.row + rowDiff][player.col])) { // move vertical
        player.row += rowDiff;
      } else if (canStandAt(currentRoom.arr[player.row][player.col + colDiff])) { // move horizontal
        player.col += colDiff;
      }
      var item = currentRoom.items[player.row][player.col];
      if (item != null) {
        playerPickup(item);
        currentRoom.items[player.row][player.col] = null;
      }
      currentRoom.arr[player.row][player.col] = player;
    }
  }
}

function playerPickup(item) {
  if (item == coin) {
    coins++;
    printSidebar();
  }
}

function loadNewRoomIfOutside(row, col) {
  if (row < 0) {
    loadRoomAt(currentRoom.row - 1, currentRoom.col, "bottom");
    return true;
  } else if (row >= currentRoom.arr.length) {
    loadRoomAt(currentRoom.row + 1, currentRoom.col, "top");
    return true;
  } else if (col < 0) {
    loadRoomAt(currentRoom.row, currentRoom.col - 1, "right");
    return true;
  } else if (col >= currentRoom.arr[0].length) {
    loadRoomAt(currentRoom.row, currentRoom.col + 1, "left");
    return true;
  }
  return false;
}

// Makes sure the player isn't hitting a wall
function canStandAt(loc) {
  return loc == null || !loc.solid;
}

var keysDown = [];
// When a key is pressed down, add it to the array of keys that are down
function addKeyToKeyArray(e) {
  if (!keysDown.includes(e.keyCode)) {
    keysDown.unshift(e.keyCode);
  }
}
// When a key is unpressed, remove it from the array of keys that are down
function removeKeyFromKeyArray(e) {
  var index = keysDown.indexOf(e.keyCode);
  if (index > -1) {
    keysDown.splice(index, 1);
  }
}
// Iterate through keysDown and set the necessary variables
function keyCheck() {
  movingL = movingR = movingU = movingD = false;
  for (var i = 0; i < keysDown.length; i++) {
    var key = keysDown[i];

    // WASD
    if (key == 65) movingL = true;
    else if (key == 68) movingR = true;
    else if (key == 87) movingU = true;
    else if (key == 83) movingD = true;

    // IJKL
    if (canShoot) {
      if (key == 73) playerShoot(-1, 0);
      else if (key == 74) playerShoot(0, -1);
      else if (key == 75) playerShoot(1, 0);
      else if (key == 76) playerShoot(0, 1);
    }
  }
}

// Shoots a projectile from the player with the given row direction
// and column direction (can be a weird angle like playerShoot(1.5, 0.7))
function playerShoot(rowDir, colDir) {
  canShoot = false;
  var timeUntilCanShoot = 200;
  setTimeout(function() {
    canShoot = true;
  }, timeUntilCanShoot);
  var initRowPos = player.row + (rowDir != 0 ? 1 : 0) * (rowDir < 0 ? -1 : 1);
  var initColPos = player.col + (colDir != 0 ? 1 : 0) * (colDir < 0 ? -1 : 1);
  var p = new projectile(initRowPos, initColPos, rowDir, colDir, currentRoom);
  placeProjectileAt(p, initRowPos, initColPos);
}

// Constructor for a projectile object
function projectile(rowPos, colPos, rowDir, colDir, whichRoom) {
  this.room = whichRoom;
  this.char = 'o';
  this.rowDir = rowDir;
  this.colDir = colDir;
  this.rowPos = rowPos;
  this.colPos = colPos;
  var updateTime = 40;
  var self = this;
  this.timer = setInterval(function() {
    updateProjectile(self);
  }, updateTime);
  // Self explanatory, destroys the projectile
  this.destroy = function() {
    clearInterval(this.timer);
    var floorRowPos = Math.floor(this.rowPos - this.rowDir);
    var floorColPos = Math.floor(this.colPos - this.colDir);
    if (this.room.arr[floorRowPos][floorColPos] == self) {
      this.room.arr[floorRowPos][floorColPos] = null;
    }
  }
}

// Updates a projectile based on its saved direction. This should only
// ever be called by the projectile object itself.
function updateProjectile(p) {
  var floorRowPos = Math.floor(p.rowPos);
  var floorColPos = Math.floor(p.colPos);
  p.room.arr[floorRowPos][floorColPos] = null;
  p.rowPos += p.rowDir;
  p.colPos += p.colDir;
  floorRowPos = Math.floor(p.rowPos);
  floorColPos = Math.floor(p.colPos);
  placeProjectileAt(p, floorRowPos, floorColPos);
}

// Attempts to place the projectile p in the projectile's room grid at the given
// row and col position. If it collides with something, deals with it
// based on what the object is that it collides with (eg damages enemies)
function placeProjectileAt(p, rowPos, colPos) {
  if (roomContains(rowPos, colPos, p.room)) {
    var collider = p.room.arr[rowPos][colPos];
    if (collider != null && collider.solid) {
      if (collider.damage != null) {
        collider.damage();
      }
      p.destroy();
    } else {
      p.room.arr[rowPos][colPos] = p;
    }
  } else {
    p.destroy();
  }
}

// Shorthand because I'm lazy
function id(selector) {
  return document.getElementById(selector);
}
