
// Constructor for a projectile object
function projectile(rowPos, colPos, rowDir, colDir, whichRoom) {
    this.room = whichRoom;
    this.char = 'o';
    this.rowDir = rowDir;
    this.colDir = colDir;
    this.rowPos = rowPos;
    this.colPos = colPos;
    this.color = "gray";
    var updateTime = 40;
    var self = this;
    this.timer = setInterval(function () {
        updateProjectile(self);
    }, updateTime);
    // Self explanatory, destroys the projectile
    this.destroy = function () {
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