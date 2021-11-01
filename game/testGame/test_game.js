import {Turn, random} from "../Game/helper.js";
import Sound from "../Game/sound_container.js";

export default class TestGame {
    map = null;
    uI = 0;
    etalonUnits = [];
    cloneUnits = [];
    constructor(map, etalonUnits, userId) {
        this.map = map;
        this.etalonUnits = etalonUnits;
        this.userId = userId;
        this.uI = this.findUser();
        this.preparation();
        this.counter = 0;
        this.pause = false;
        this.defeat = false;
        this.win = false;
        this.bonus = 0;
    }
    findUser(){
        for(let i = 0; i < this.etalonUnits.length; ++i){
            if(this.userId === this.etalonUnits[i].userId)
                return i;
        }
    }
    preparation() {
        this.etalonUnits.forEach((etalonUnit, index) =>{
            etalonUnit.pos.coords.X = this.map.unitsCoords[index].X;
            etalonUnit.pos.coords.Y = this.map.unitsCoords[index].Y;
            etalonUnit.turn = this.map.startUnitsTurn[index];
            etalonUnit.id = this.map.backId.units[index];
            etalonUnit.homeId = this.map.backId.homes[index];
            etalonUnit.gun.degree = etalonUnit.turn * 90;
            this.cloneUnits[index] = _.cloneDeep(etalonUnit);
            this.cloneUnits[index].map = etalonUnit.map = this.map;
            this.cloneUnits[index].width = this.cloneUnits[index].height = this.map.unitWidth;
            this.cloneUnits[index].bullet.map = etalonUnit.bullet.map = this.map;
            this.cloneUnits[index].bullet.width =
                this.cloneUnits[index].bullet.height =
                Math.round(this.map.unitWidth/5);
            this.map.backArray.push(this.cloneUnits[index]);
            if(this.userId === etalonUnit.userId) {
                this.cloneUnits[index].control = etalonUnit.control;
                this.cloneUnits[index].control.mouseMove();
                this.cloneUnits[index].control.mouseDown();
                this.cloneUnits[index].control.mouseUp();
                this.cloneUnits[index].control.keyDown();
                this.cloneUnits[index].control.keyUp();
            }
        });
        this.map.towers.forEach((tower, index) =>{
            tower.map = this.map;
            tower.bullet.map = this.map;
            tower.id = this.map.backId.towers[index];
            tower.pos.coords = this.map.towersCoords[index];
            tower.turn = (tower.side === "Blue") ? Turn.left : Turn.right;
            tower.gun.degree = (tower.side === "Blue") ? 180 : 0;
            tower.targets = this.cloneUnits.filter(unit=> tower.side !== unit.side);
            tower.allies = this.cloneUnits.filter(unit => tower.side === unit.side);
            tower.width = tower.height = this.map.unitWidth;
            this.map.backArray.push(tower);
            tower.update(tower.pos.coords);
        });
        this.map.mobs.forEach((mob, index) => {
            mob.map = this.map;
            mob.bullet.map = this.map;
            mob.id = this.map.backId.mobs[index];
            mob.pos.coords = this.map.mobsCoords[index];
            mob.targets = this.cloneUnits.filter(unit=> mob.side !== unit.side);
            mob.allies = this.cloneUnits.filter(unit => mob.side === unit.side);
            mob.width = mob.height = this.map.unitWidth;
            this.map.backArray.push(mob);
            mob.update(mob.pos.coords);
        });
        this.map.etalonMobs.forEach((mob, index) => {
            mob.map = this.map;
            mob.bullet.map = this.map;
            mob.id = this.map.backId.mobs[index];
            mob.pos.coords = this.map.mobsCoords[index];
            mob.targets = this.cloneUnits.filter(unit=> mob.side !== unit.side);
            mob.allies = this.cloneUnits.filter(unit => mob.side === unit.side);
        });
        this.cloneUnits.forEach(cloneUnit =>{
            cloneUnit.targets = this.cloneUnits.filter(unit => cloneUnit.side !== unit.side);
            this.map.towers.filter(tower => cloneUnit.side !== tower.side).forEach(tower =>{
                cloneUnit.targets.push(tower);
            });
            this.map.mobs.filter(mob => cloneUnit.side !== mob.side).forEach(mob =>{
                cloneUnit.targets.push(mob);
            });
            cloneUnit.targets.push((cloneUnit.side === "Red") ?
                this.map.blueBase : this.map.redBase);
            cloneUnit.allies = this.cloneUnits.filter(unit => cloneUnit.side === unit.side);
        });
        this.map.baseTowers.forEach(tower =>{
            tower.map = this.map;
            tower.bullet.map = this.map;
            tower.targets = this.cloneUnits.filter(unit=> tower.side !== unit.side);
            tower.allies = this.cloneUnits.filter(unit => tower.side === unit.side);
        });
        this.map.redBase.id = this.map.backId.redBase;
        this.map.blueBase.id = this.map.backId.blueBase;
        this.map.redBase.tower1.id = 1000;
        this.map.blueBase.tower2.id = 1001;
        this.map.blueBase.tower1.id = 1002;
        this.map.blueBase.tower2.id = 1003;
        this.sound = new Sound(this.map.redBase, this.map.blueBase, this.cloneUnits[this.uI],
            this.cloneUnits, this.map.towers, this.map.mobs);
    }
    unitsBackFill(){
        this.cloneUnits.forEach(cloneUnit=>{
            cloneUnit.pos.pastCoords.X = cloneUnit.pos.coords.X;
            cloneUnit.pos.pastCoords.Y = cloneUnit.pos.coords.Y;
            cloneUnit.update(cloneUnit.pos.coords);
            cloneUnit.checkFrontWay(1);
        });

    }
    run() {
        if(this.cloneUnits[this.uI].control.buttonUp === "Space"){
            this.pause = this.pause === false;
            this.cloneUnits[this.uI].control.buttonUp = "";
        }
        if(!this.pause && !this.win && !this.defeat) {
            this.counter++;
            if (this.counter > 5400) this.counter = 0;
            this.unitsBackFill();
            this.cloneUnits.forEach((cloneUnit, index) => {
                if (this.uI !== index) {
                    this.botLogic(cloneUnit);
                    if (cloneUnit.target !== null)
                        cloneUnit.hunt(cloneUnit.target);
                    cloneUnit.shot();
                    this.crash(cloneUnit, this.etalonUnits[index]);
                    this.rebirth(cloneUnit, this.etalonUnits[index]);
                }
            });
            this.map.baseTowers.forEach(tower => {
                tower.shot();
            });
            this.map.towers.forEach(tower => {
                tower.shot();
            });
            this.map.mobs.forEach((mob, index) => {
                if (mob.uc.health < mob.etalonUc.health)
                    mob.shot();
                this.crash(mob, this.map.etalonMobs[index]);
                this.rebirth(mob, this.map.etalonMobs[index]);
            })
            this.cloneUnits[this.uI].controlHandling();
            this.cloneUnits[this.uI].shot();
            this.cloneUnits[this.uI].levelUp();
            this.crash(this.cloneUnits[this.uI], this.etalonUnits[this.uI]);
            this.rebirth(this.cloneUnits[this.uI], this.etalonUnits[this.uI]);
            this.gameOver();
        }
    }
    gameOver(){
        if((this.cloneUnits[this.uI].side === "Red" && this.map.blueBase.uc.health <= 0) ||
            (this.cloneUnits[this.uI].side === "Blue" && this.map.redBase.uc.health <= 0)){
            ++this.etalonUnits[this.uI].wins;
            ++this.etalonUnits[this.uI].battles;
            this.etalonUnits[this.uI].kills = this.cloneUnits[this.uI].kills;
            this.bonus = random(500, 1000);
            this.etalonUnits[this.uI].money += this.bonus;
            this.win = true;
        }
        else if((this.cloneUnits[this.uI].side === "Red" && this.map.redBase.uc.health <= 0) ||
            (this.cloneUnits[this.uI].side === "Blue" && this.map.blueBase.uc.health <= 0)){
            ++this.etalonUnits[this.uI].defeats;
            ++this.etalonUnits[this.uI].battles;
            this.etalonUnits[this.uI].kills = this.cloneUnits[this.uI].kills;
            this.bonus = random(200, 300);
            this.etalonUnits[this.uI].money += this.bonus;
            this.defeat = true;
        }
    }
    botLogic(cloneUnit){
        if(this.counter % 1200 === 0 || this.counter === 1 ||
            cloneUnit.target === null || cloneUnit.target.uc.health <= 0) {
            let ways = new Map();
            cloneUnit.targets.forEach((target, index) => {
                let distanceX = Math.abs(target.pos.coords.X - cloneUnit.pos.coords.X);
                let distanceY = Math.abs(target.pos.coords.Y - cloneUnit.pos.coords.Y);
                ways.set(index, Math.round(Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2))));
            });
            const sortWays = new Map([...ways.entries()].sort((a, b) => a[1] - b[1]));
            let hasTarget = false;
            for (let key of sortWays.keys()) {
                for(let unit of this.cloneUnits) {
                    if(unit.target === unit.targets[key]) break;
                    if (cloneUnit.targets[key].uc.health > 0) {
                        cloneUnit.target = cloneUnit.targets[key];
                        hasTarget = true;
                        break;
                    }
                }
                if(hasTarget) break;
            }
        }
    }
    crash(clone, etalon) {
        if (clone.uc.health <= 0 && clone.uc.respawnTime === clone.etalonUc.respawnTime) {
            clone.pos.crashCoords.X = clone.pos.coords.X;
            clone.pos.crashCoords.Y = clone.pos.coords.Y;
            clone.turn = etalon.turn;
            clone.gun.degree = etalon.gun.degree;
            clone.pos.coords.X = etalon.pos.coords.X;
            clone.pos.coords.Y = etalon.pos.coords.Y;
        }
        if (clone.uc.health <= 0){
            --clone.uc.respawnTime;
        }
    }
    rebirth(clone)
    {
        if (clone.uc.respawnTime <= 0){
            clone.uc.respawnTime = clone.etalonUc.respawnTime;
            clone.uc.armor = clone.etalonUc.armor;
            clone.uc.health = clone.etalonUc.health;
        }
    }
}
