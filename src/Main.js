var map; // 2d array of references to rooms (which themselves are 2d arrays)
var currentRoom;

window.onload = function () {
    window.onkeydown = addKeyToKeyArray;
    window.onkeyup = removeKeyFromKeyArray;
    generateRooms();
    currentRoom.roomComplete();
    printSidebar();
    addPlayerToRoom();

    gameLoop = setInterval(function () {  // main game loop
        if (health > 0) {
            updatePlayer();
            keyCheck();
            currentRoom.updateEnemies();
            printRoom();
        } else {
            printDeathMessage();
        }
    }, 75);
}