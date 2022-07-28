import {Coords, Turn, Position, UnitCharacteristics, MapElement} from "./helper.js";
import Bullet from "./bullet.js";

export default class Unit extends MapElement{
    userId = "None";
    name = 'NoName';
    side = 'red';
    homeId = 1111;
    ability = 0;
    turn = 0;
    bulletType = 0;
    reload = 0;
    speedController = 1;
    trigger = false;
    uc = null;
    etalonUc = null;
    kill = null;
    map = null;
    bullet = null;
    pos = null;
    targets = null;
    allies = null;
    ammunition = null;
    gun = null;
    constructor(
        uc = new UnitCharacteristics(),
        gun = {
            model: 'gun_2',
            degree: 0,
        },
        ammunition = [
            {
                model: 'bullet_1',
                damage: 1,
                quantity: 10000,
                shot_model: 'bullet_1_shot',
                boom_model: 'bullet_1_boom',
                shot_coords: new Coords(0,0),
                boom_coords: new Coords(0,0),
            }
        ],
        ability = 0)
    {
        super();
        this.uc = uc;
        this.etalonUc = Object.assign({}, this.uc);
        this.ammunition = ammunition;
        this.bullet = new Bullet(this);
        this.pos = new Position();
        this.gun = gun;
        this.ability = ability;
    }
    levelUp(){
        if(this.kill !== null){
            this.uc.experience += this.kill.etalonUc.health;
            if(this.uc.experience > this.uc.level * 20){
                this.uc.experience -= this.uc.level * 20;
                ++this.uc.level;
                ++this.etalonUc.level;
                ++this.uc.commandPoints;
                ++this.etalonUc.commandPoints;
                if(this.uc.level%2===0){
                    this.etalonUc.health += 5;
                }
                if(this.uc.level%2 !== 0){
                    this.etalonUc.armor += 5;
                }
                if(this.etalonUc.speed < 12 && this.uc.level%3===0){
                    this.uc.speed += 1;
                    this.etalonUc.speed += 1;
                }
                if(this.etalonUc.shotPower <= 10 && this.uc.level%2 !== 0){
                    this.uc.shotPower += 1;
                    this.etalonUc.shotPower += 1;
                }
            }
        }
        this.experienceToLevel = this.uc.level * 20;
    }
    roadEffect(position){
        if(this.side === "red") {
            if (position === this.map.backId.hpRegenRed && this.uc.health < this.etalonUc.health)
                this.uc.health += 0.1;
            if (position === this.map.backId.hpRegenBlue && this.uc.health >= 0)
                this.uc.health -= 0.1;
        }
        else{
            if (position === this.map.backId.hpRegenBlue && this.uc.health < this.etalonUc.health)
                this.uc.health += 0.1;
            if (position === this.map.backId.hpRegenRed && this.uc.health >= 0)
                this.uc.health -= 0.1;
        }
        if(position === this.map.backId.cpRegen && this.uc.armor < this.etalonUc.armor)
            this.uc.armor += 0.1;
        if(position === this.map.backId.sand) {
            this.uc.speed = 2;
            this.speedController = 2;
        }
    }
    checkFrontWay(step)
    {
        let effect = false;
        let positions = this.look(step);
        let result = true;
        positions.forEach(position => {
            if( position === this.map.backId.hpRegenRed ||
                position === this.map.backId.cpRegen ||
                position === this.map.backId.hpRegenBlue ||
                position === this.map.backId.sand) {
                effect = true;
            }
            else result = position === this.map.backId.road;
            if(effect) {
                this.roadEffect(position);
            }
            else {
                this.uc.speed = this.etalonUc.speed;
            }
        });
        return result;
    }
    look(step){
        this.update(this.pos.coords);
        let positions = [];
        switch (this.turn){
            case Turn.right:{
                for(let i = 0; i < this.map.backArray.length; ++i){
                    if(this.BRX + step + 1 < this.map.backArray[i].TLX ||
                        this.TLX + step + 1 > this.map.backArray[i].BRX) continue;
                    if(this.BRY < this.map.backArray[i].TLY ||
                        this.TLY > this.map.backArray[i].BRY) continue;
                    if(this.id === this.map.backArray[i].id ||
                    this.homeId === this.map.backArray[i].id) continue;
                    positions.push(this.map.backArray[i].id);
                }
                break;
            }
            case Turn.bottom:{
                for(let i = 0; i < this.map.backArray.length; ++i){
                    if(this.BRX < this.map.backArray[i].TLX ||
                        this.TLX > this.map.backArray[i].BRX) continue;
                    if(this.BRY + step + 1 < this.map.backArray[i].TLY ||
                        this.TLY + step + 1 > this.map.backArray[i].BRY) continue;
                    if(this.id === this.map.backArray[i].id ||
                        this.homeId === this.map.backArray[i].id) continue;
                    positions.push(this.map.backArray[i].id);
                }
                break;
            }
            case Turn.left:{
                for(let i = 0; i < this.map.backArray.length; ++i){
                    if(this.BRX - step - 1 < this.map.backArray[i].TLX ||
                        this.TLX - step - 1 > this.map.backArray[i].BRX) continue;
                    if(this.BRY < this.map.backArray[i].TLY ||
                        this.TLY > this.map.backArray[i].BRY) continue;
                    if(this.id === this.map.backArray[i].id ||
                        this.homeId === this.map.backArray[i].id) continue;
                    positions.push(this.map.backArray[i].id);
                }
                break;
            }
            case Turn.top:{
                for(let i = 0; i < this.map.backArray.length; ++i){
                    if(this.BRX < this.map.backArray[i].TLX ||
                        this.TLX > this.map.backArray[i].BRX) continue;
                    if(this.BRY - step - 1 < this.map.backArray[i].TLY ||
                        this.TLY - step - 1 > this.map.backArray[i].BRY) continue;
                    if(this.id === this.map.backArray[i].id ||
                        this.homeId === this.map.backArray[i].id) continue;
                    positions.push(this.map.backArray[i].id);
                }
                break;
            }
        }
        if(positions.length === 0){
            positions.push(this.map.backId.road);
            return positions;
        }
        else return positions;
    }
    setPosition(step, flag){
        switch (this.turn){
            case Turn.right:{
                this.pos.coords.X = (flag) ? this.pos.coords.X + step : this.pos.coords.X - step;
                break;
            }
            case Turn.bottom:{
                this.pos.coords.Y = (flag) ? this.pos.coords.Y + step : this.pos.coords.Y - step;
                break;
            }
            case Turn.left:{
                this.pos.coords.X = (flag) ? this.pos.coords.X - step : this.pos.coords.X + step;
                break;
            }
            case Turn.top:{
                this.pos.coords.Y = (flag) ? this.pos.coords.Y - step : this.pos.coords.Y + step;
                break;
            }
        }
        this.update(this.pos.coords);
    }
    searchTarget(target){
            let checkX = target.pos.coords.X < this.pos.coords.X + this.uc.shotDistance &&
                target.pos.coords.X > this.pos.coords.X - this.uc.shotDistance;
            let checkY = target.pos.coords.Y < this.pos.coords.Y + this.uc.shotDistance &&
                target.pos.coords.Y > this.pos.coords.Y - this.uc.shotDistance;
            return (checkX && checkY && target.uc.health > 0);
    }
}
