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

// Returns true if the indeces are within the map's bounds
function mapContains(row, col) {
    return row >= 0 && row < map.length && col >= 0 && col < map[0].length;
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