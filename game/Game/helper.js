export class Coords{
    X = 0;
    Y = 0;
    constructor(X,Y) {
        this.X = X;
        this.Y = Y;
    }
}

export class Turn{
    static right = 0;
    static bottom = 1;
    static left = 2;
    static top = 3;
}

export class BackId{
    road = 0;
    wall = 1;
    closeRoad = 2;
    redBase = 3;
    blueBase = 4;
    bullet = 5;
    water = 6;
    sand = 7
    hpRegenRed = 8;
    hpRegenBlue = 9;
    cpRegen = 10;
    next = 11;
    units = [];
    towers = [];
    mobs = [];
    homes = []
    constructor(unitsCount, towersCount, mobsCount) {
        for (let i = 0; i < unitsCount; ++i){
            this.units.push(this.next + i);
        }
        for(let i = 0; i < unitsCount; ++ i){
            this.homes.push(this.next + unitsCount + i);
        }
        for(let i = 0; i < towersCount; ++ i){
            this.towers.push(this.next + 2 * unitsCount + i);
        }
        for(let i = 0; i < mobsCount; ++i){
            this.mobs.push(this.next + 2 * unitsCount + towersCount + i);
        }
    }
}

export class Position{
    coords = new Coords(0, 0);
    pastCoords = new Coords(0, 0);
    renderCoords = new Coords(0, 0);
    crashCoords = new Coords(0, 0);
    renderCrashCoords = new Coords(0, 0);
    deltaCoords = new Coords(0, 0);
    perimCoords = [];
}
export class MapElement{
    constructor(TLX = 0, TLY = 0, width = 0, height = 0, id = 0){
        this.id = id;
        this.width = width;
        this.height = height;
        this.TLX = TLX;
        this.TLY = TLY;
        this.BRX = this.TLX + this.width;
        this.BRY = this.TLY + this.height;
    }
    update(coords){
        this.TLX = coords.X;
        this.TLY = coords.Y;
        this.BRX = this.TLX + this.width;
        this.BRY = this.TLY + this.height;
    }
}

export class UnitCharacteristics{
    constructor(
        model = "T_2",
        health = 20,
        armor = 20,
        speed = 6,
        shotPower = 2,
        shotDistance = 200,
        respawnTime = 600,
        level = 1,
        experience = 0,
        commandPoints = 0,
    ){
        this.model = model;
        this.health = health;
        this.armor = armor;
        this.speed = speed;
        this.shotPower = shotPower;
        this.shotDistance = shotDistance;
        this.respawnTime = respawnTime;
        this.level = level;
        this.experience = experience;
        this.commandPoints = commandPoints;
    }
}

export function random(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}


