import {Coords, Turn, UnitCharacteristics} from "./helper.js";
import Unit from "./unit.js";

export default class TankBot extends Unit{
    directionPriority = true;
    turnFlag = true;
    counter = 0;
    target = null;
    constructor(
        side = "Blue",
        model = "T_2",
        health = 100,
        armor = 20,
        speed = 5,
        shotPower = 1,
        shotDistance = 200,
        respawnTime = 100,
        gun = {
            model: "gun_2",
            degree: 0,
            coords: new Coords(0, 0),
        },
        ammunition = [
            {
                model: "bullet_1",
                damage: 1,
                quantity: 10000,
                shot_model: "bullet_1_shot",
                boom_model: "bullet_1_boom",
                shot_coords: new Coords(0,0),
                boom_coords: new Coords(0,0),
            }
        ],
        ability = 0
        ) {
        super(new UnitCharacteristics(model, health, armor, speed, shotPower, shotDistance, respawnTime),
            gun, ammunition, ability);
        this.side = side.toLowerCase();
    }

    checkTarget1(target){
        switch (this.turn)
        {
            case Turn.right:{
                this.turn = (this.directionPriority) ? Turn.top : Turn.bottom;
                let temp = this.checkCollision(false);
                this.turn = Turn.right;
                return (this.pos.coords.X < target.pos.coords.X || temp);
            }
            case Turn.bottom:{
                this.turn = (this.directionPriority) ? Turn.right : Turn.left;
                let temp = this.checkCollision(false);
                this.turn = Turn.bottom;
                return (this.pos.coords.Y < target.pos.coords.Y  || temp);
            }
            case Turn.left:{
                this.turn = (this.directionPriority) ? Turn.bottom : Turn.top;
                let temp = this.checkCollision(false);
                this.turn = Turn.left;
                return (this.pos.coords.X > target.pos.coords.X || temp);
            }
            case Turn.top:{
                this.turn = (this.directionPriority) ? Turn.left : Turn.right;
                let temp = this.checkCollision(false);
                this.turn = Turn.top;
                return (this.pos.coords.Y > target.pos.coords.Y || temp);
            }
        }
        return true;
    }

    checkTarget2(target)
    {
        let distance = this.uc.shotDistance - Math.round(this.uc.shotDistance/4);
        let range = (target.id !== this.map.backId.redBase &&
    target.id !== this.map.backId.blueBase) ?
            this.map.unitWidth + 2:
            Math.round(this.map.unitWidth / 2);
        switch (this.turn){
            case Turn.right:{
                return (this.pos.coords.X < target.pos.coords.X - distance ||
                    this.pos.coords.Y > target.pos.coords.Y + range ||
                    this.pos.coords.Y < target.pos.coords.Y - range);
            }
            case Turn.bottom:{
                return (this.pos.coords.Y < target.pos.coords.Y - distance ||
                    this.pos.coords.X > target.pos.coords.X + range ||
                    this.pos.coords.X < target.pos.coords.X - range);
            }
            case Turn.left:{
                return (this.pos.coords.X > target.pos.coords.X + distance ||
                    this.pos.coords.Y > target.pos.coords.Y + range ||
                    this.pos.coords.Y < target.pos.coords.Y - range);
            }
            case Turn.top:{
                return (this.pos.coords.Y > target.pos.coords.Y + distance ||
                    this.pos.coords.X > target.pos.coords.X + range ||
                    this.pos.coords.X < target.pos.coords.X - range);
            }
        }
        return true;
    }
    checkCollision(flag)
    {
        let collision = false;
        if (flag){
            for (let i = this.uc.speed; i > 0; --i){
                collision = false;
                this.setPosition(i, true);
                if (!this.checkFrontWay(i)){
                    this.setPosition(i, false);
                    collision = true;
                }
                if (collision === false) break;
            }
        }
        else if(!this.checkFrontWay(this.uc.speed)){
                collision = true;
        }
        return collision;
    }

    hunt(target)
    {
        this.turnGun(target);
        if (target !== null && this.uc.health > 0)
        {
            if (this.directionPriority){
                if (this.turnFlag === false && this.turn === Turn.top){
                    this.turn = Turn.right;
                }
                else if (this.turnFlag === false) {
                    this.turn += 1;
                }
            }
            else
            {
                if (this.turnFlag === false && this.turn === Turn.right){
                    this.turn = Turn.top;
                }
                else if (this.turnFlag === false) {
                    this.turn -= 1;
                }
            }
            if(this.side === "red" && this.turnFlag)
                this.directionPriority = this.pos.coords.Y < Math.round(this.map.frontHeight / 2);
            else if(this.turnFlag)
                this.directionPriority = this.pos.coords.Y > Math.round(this.map.frontHeight / 2);
            this.turnFlag = true;
            if (this.checkTarget1(target)) {
                if (this.checkTarget2(target)) {
                    if (this.checkCollision(true)) {
                        if (this.checkCollision(false)) {
                            this.turn = (this.directionPriority) ? this.turn - 1 : this.turn + 1;
                            this.turnClosure();
                            this.turnFlag = this.checkCollision(true);
                        }
                    }
                }
            }
            else
                this.turn = (this.directionPriority) ? this.turn - 1 : this.turn + 1;
            this.turnClosure();
        }
    }
    turnClosure(){
        if (this.turn < Turn.right) this.turn = Turn.top;
        if (this.turn > Turn.top) this.turn = Turn.right;
    }
    turnGun(target){
        let angleAX = Math.round(this.map.unitWidth/2);
        let angleAY = Math.round(this.map.unitWidth/2);
        let angleBX = target.pos.coords.X + Math.round(this.map.unitWidth/2);
        let angleBY = target.pos.coords.Y + Math.round(this.map.unitWidth/2);
        let coordsAX = this.pos.coords.X + angleAX;
        let coordsAY = this.pos.coords.Y + angleAY;
        let tgA = (angleBY - coordsAY) / (angleBX - coordsAX);
        if(coordsAX <= angleBX)
            this.gun.degree = Math.atan(tgA) * 180 / Math.PI;
        else
            this.gun.degree = Math.atan(tgA) * 180 / Math.PI + 180;
    }
    shot(){
        this.counter++;
        let nearestTarget = null;
        for(let target of this.targets){
            if (this.uc.health > 0 && target.uc.health > 0 && this.searchTarget(target)){
                nearestTarget = target;
                break;
            }
        }
        if(nearestTarget !== null){
            this.turnGun(nearestTarget);
            this.trigger = true;
        }
        if (this.trigger) {
            if (this.counter % 2 === 0 && this.reload === this.bullet.speed) {
                this.bullet.move();
            }
            if (this.counter % 2 === 0) {
                this.reload++;
            }
            this.kill = this.bullet.fatalHit();
            if (this.reload > 10) {
                this.trigger = false;
                this.bullet.hit = false;
                this.bullet.hitMiss = false;
                this.reload = 0;
            }
        }
    }
}
