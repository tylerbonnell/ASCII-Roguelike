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