// Pads a string with spaces so it is right-aligned on a line with the overallWidth
function addSpacesBefore(overallWidth, str) {
    while (str.length < overallWidth) {
        str = " " + str;
    }
    return str;
}

// Prints the room on the page (needs to be called to see anything happen)
function printRoom() {
    var pre = id("game-area");
    var str = "";
    for (var i = 0; i < currentRoom.arr.length; i++) {
        for (var j = 0; j < currentRoom.arr[i].length; j++) {
            if (i == player.row && j == player.col) {
                str += charString(player);
            } else if (currentRoom.arr[i][j] != null) {
                str += charString(currentRoom.arr[i][j]);
            } else if (currentRoom.items[i][j] != null) {
                str += charString(currentRoom.items[i][j]);
            } else {
                str += ' ';
            }
        }
        str += "\n";
    }
    pre.innerHTML = str;
}

// Adds a color span around a character if it should be colored
function charString(char) {
    if (char.color) {
        return "<span style=\"color:" + char.color + "\">" + char.char + "</span>";
    }
    return char.char;
}

// Prints the map of rooms, including showing current room
function printSidebar() {
    // Print the map
    var str = "+";
    var sidebarWidth = map[0].length + 2;
    for (var i = 0; i < map[0].length; i++) {
        str += "="
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
        str += "="
    }
    str += "+\n\n";
    var healthStr = "";
    var ceilHealth = Math.ceil(health);

    // Health bar
    for (var i = 0; i < maxHealth - ceilHealth; i++) {
        healthStr += heartContainer.char;
    }
    for (var i = 0; i < ceilHealth; i++) {
        healthStr += heart.char;
    }
    str += addSpacesBefore(sidebarWidth, healthStr);
    str += "\n\n"

    // Coins
    if (coins > 0) {
        str += addSpacesBefore(sidebarWidth, coins + coin.char) + "\n\n";
    }
    id("map").innerHTML = str;
}

// End of game message
function printDeathMessage() {
    id("game-area").innerHTML = " __   __  _______  __   __    ______   ___   _______  ______\n" +
        "|  | |  ||       ||  | |  |  |      | |   | |       ||      |\n" +
        "|  |_|  ||   _   ||  | |  |  |  _    ||   | |    ___||  _    |\n" +
        "|       ||  | |  ||  |_|  |  | | |   ||   | |   |___ | | |   |\n" +
        "|_     _||  |_|  ||       |  | |_|   ||   | |    ___|| |_|   |\n" +
        "  |   |  |       ||       |  |       ||   | |   |___ |       |\n" +
        "  |___|  |_______||_______|  |______| |___| |_______||______|";
}

// Shorthand because I'm lazy
function id(selector) {
    return document.getElementById(selector);
}