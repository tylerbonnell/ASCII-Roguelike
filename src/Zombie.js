// Constructor for a basic zombie enemy that walks towards
// the player and tries to hurt them
function zombie(room, row, col) {
    this.room = room;
    this.row = row;
    this.col = col;
    this.rowFloat = row;
    this.colFloat = col;
    this.char = "Z";
    this.solid = true;
    this.health = 2;
    this.moveDist = 0.3;
    this.strength = 0.1;
    this.color = "OliveDrab";

    // applies damage to the enemy
    this.damage = function () {
        this.health--;
        if (this.health <= 0) {
            this.die();
        }
    }

    // makes the enemy die
    this.die = function () {
        this.dead = true;
        this.room.arr[this.row][this.col] = null;
        if (Math.random() > 0.5) {
            dropItem(coin, this.room, this.row, this.col)
        }
    }

    // makes the enemy make a single move
    this.move = function () {
        if (!roomContains(this.row, this.col, this.room)) {
            this.die();
            return;
        }
        this.room.arr[this.row][this.col] = null;
        // If they're adjacent to the player, damage them
        if ((Math.abs(player.row - this.row) == 1 && this.col == player.col) ||
            (Math.abs(player.col - this.col) == 1 && this.row == player.row)) {
            player.damage(this.strength);
        } else {
            var angle = Math.atan((this.row - player.row) / (player.col - this.col));
            var colMove = this.moveDist * Math.cos(angle) * (player.col < this.col ? -1 : 1);
            var rowMove = Math.abs(this.moveDist * Math.sin(angle)) * (player.row < this.row ? -1 : 1);
            var newCol = Math.floor(this.colFloat + colMove);
            var newRow = Math.floor(this.rowFloat + rowMove);
            if (roomContains(newRow, newCol, this.room) &&
                canStandAt(this.room.arr[newRow][newCol])) {
                this.row = newRow;
                this.col = newCol;
                this.colFloat += colMove;
                this.rowFloat += rowMove;
            }
        }
        this.room.arr[this.row][this.col] = this;
    }
}