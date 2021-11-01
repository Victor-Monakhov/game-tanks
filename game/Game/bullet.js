import {Coords, MapElement, Position, random} from "./helper.js";

export default class Bullet extends MapElement{
    map = null;
    pos = null;
    owner = null;
    target = null;
    turn = 0;
    speed = 0;
    bulletType = {
        model: "bullet_1",
        damage: 1,
        quantity: 10000,
        shot_model: "bullet_1_shot",
        boom_model: "bullet_1_boom",
        shot_coords: new Coords(0,0),
        boom_coords: new Coords(0,0),
    };
    hit = false;
    hitMiss = false;
    degree = 0;
    constructor(owner) {
        super();
        this.map = owner.map;
        this.pos = new Position();
        this.owner = owner;
        this.id = owner.id;
        this.bulletType = owner.ammunition[owner.bulletType];
    }
    look(){
        let coordsX = this.pos.coords.X + Math.round(this.map.unitWidth / 3);
        let coordsY = this.pos.coords.Y + Math.round(this.map.unitWidth / 3);
        let positions = [];
        this.update(new Coords(coordsX, coordsY));
        for (let i = 0; i < this.map.backArray.length; ++i) {
            if (this.BRX < this.map.backArray[i].TLX ||
                this.TLX > this.map.backArray[i].BRX) continue;
            if (this.BRY < this.map.backArray[i].TLY ||
                this.TLY > this.map.backArray[i].BRY) continue;
            positions.push(this.map.backArray[i].id);
        }
        if(positions.length === 0){
            positions.push(this.map.backId.road);
            return positions;
        }
        else return positions;
    }
    fatalHit(){
        if (this.target !== null && this.target.uc.health <= 0) {
            this.target.uc.health = 0;
            return this.target;
        }
        this.target = null;
        return null;
    }
    hitResult(){
        return random(this.bulletType.damage, this.owner.uc.shotPower + this.bulletType.damage);
    }

    checkHitMiss(positions){
        positions.forEach(position =>{
            this.hitMiss = (position === this.map.backId.wall);
        });
        return this.hitMiss;
    }

    checkHit(positions){
        this.hit = false;
        for (let target of this.owner.targets){
            positions.forEach(position => {
                if (position === target.id && target.uc.health > 0){
                    this.target = target;
                    let hitDamage = this.hitResult();
                    target.uc.armor = target.uc.armor - hitDamage * 2 / 3;
                    if (target.uc.armor <= 0) {
                        target.uc.armor = 0;
                        target.uc.health = target.uc.health - hitDamage;
                    }
                    else{
                        target.uc.health = target.uc.health - hitDamage/3;
                    }
                    this.hit = true;
                   // return true;
                }
            });
        }
        return this.hit;
    }
    moveHelper(coords, step){
        let sideX = Math.cos(this.degree * Math.PI / 180) * step;
        let sideY = Math.sin(this.degree * Math.PI / 180) * step;
        coords.X += Math.round(sideX);
        coords.Y += Math.round(sideY);
    }
    move(){
        if (this.speed === 0) {
            this.pos.coords = Object.assign({}, this.owner.pos.coords);
            this.pos.renderCoords = Object.assign({}, this.owner.pos.renderCoords);
            this.degree = this.owner.gun.degree;
            this.turn = this.owner.turn;
            this.bulletType = this.owner.ammunition[this.owner.bulletType];
            --this.owner.ammunition[this.owner.bulletType].quantity;
        }
        let step = Math.floor(this.owner.uc.shotDistance / 10);
        this.moveHelper(this.pos.coords, step);
        this.moveHelper(this.pos.renderCoords, step);
        let positions = this.look();
        ++this.speed;
        if (this.checkHitMiss(positions) || this.checkHit(positions)) {
            this.speed = 0;
        }
        if (this.speed > 10) {
            this.speed = 0;
        }
    }
}
