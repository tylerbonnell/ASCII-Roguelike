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
    this.generateRoom = function () {
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
    this.addDoorAtRow = function (row) {
        var doorMid = randomInt(3, this.arr[0].length - 4);
        var d = new door(this, [row, doorMid, row, doorMid + 1, row, doorMid - 1]);
        this.doors.push(d);
        if (row == 0) this.topDoor = d;
        else this.bottomDoor = d;
        return d;
    }

    // adds a door on the given col (should be furthest left or right)
    this.addDoorAtCol = function (col) {
        var doorMid = randomInt(3, this.arr.length - 4);
        var d = new door(this, [doorMid, col, doorMid + 1, col, doorMid - 1, col]);
        this.doors.push(d);
        if (col == 0) this.leftDoor = d;
        else this.rightDoor = d;
        return d;
    }

    // marks the room as complete, opens all doors that don't require a key
    // (keys aren't implemented yet, so currently opens all doors)
    this.roomComplete = function () {
        this.completed = true;
        for (var i = 0; i < this.doors.length; i++) {
            this.doors[i].open();
        }
    }

    // generates all the enemies for the room
    this.generateEnemies = function () {
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

    this.updateEnemies = function () {
        for (var i = 0; i < this.enemies.length; i++) {
            if (this.enemies[i].dead) {
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

// Constructor for a door object. Takes an array of ints which represent the row and col
// of each location of the door (since doors can occupy multiple spaces)
function door(room, rowsAndCols) {
    this.solid = true;
    this.char = "D";
    this.locations = rowsAndCols;
    this.room = room;
    this.opened = false;
    for (var i = 0; i < rowsAndCols.length; i += 2) {
        room.arr[rowsAndCols[i]][rowsAndCols[i + 1]] = this;
    }
    // opens the door, takes the room it is currently in as a parameter
    this.open = function () {
        if (!this.opened) {
            this.opened = true;
            for (var i = 0; i < this.locations.length; i += 2) {
                room.arr[this.locations[i]][this.locations[i + 1]] = null;
            }
            if (this.opposite != null) {
                this.opposite.open();
            }
        }
    }
}

// Drops an item in the given room
function dropItem(item, room, row, col) {
    room.items[row][col] = item;
}

// Returns true if the indeces are within a room's bound
// if no room is specified, looks at the currentRoom
function roomContains(row, col, room) {
    if (!room) {
        room = currentRoom;
    }
    return row >= 0 && row < room.arr.length && col >= 0 && col < room.arr[0].length;
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
