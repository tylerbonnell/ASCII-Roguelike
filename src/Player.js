// Player State
var movingL = false;
var movingR = false;
var movingU = false;
var movingD = false;
var canShoot = true;
var maxHealth = 3;
var health = maxHealth;
var coins = 0;

var player = {
    char: '$',
    solid: true,
    color: "CornflowerBlue",
    damage: function (dmg) {
        console.log("hit");
        health -= dmg;
        printSidebar();
    }
};

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

// Shoots a projectile from the player with the given row direction
// and column direction (can be a weird angle like playerShoot(1.5, 0.7))
function playerShoot(rowDir, colDir) {
    canShoot = false;
    var timeUntilCanShoot = 200;
    setTimeout(function () {
        canShoot = true;
    }, timeUntilCanShoot);
    var initRowPos = player.row + (rowDir != 0 ? 1 : 0) * (rowDir < 0 ? -1 : 1);
    var initColPos = player.col + (colDir != 0 ? 1 : 0) * (colDir < 0 ? -1 : 1);
    var p = new projectile(initRowPos, initColPos, rowDir, colDir, currentRoom);
    placeProjectileAt(p, initRowPos, initColPos);
}