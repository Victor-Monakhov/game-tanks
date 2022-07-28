import Unit from "./unit.js";
import {Coords, Turn} from "./helper.js";

export default class Tank extends Unit{
    experienceToLevel = 0;
    money = 0;
    battles = 0;
    wins = 0;
    kills = 0;
    killsInGame = 0;
    defeats = 0;
    counter = 0;
    control = null;
    constructor(control, userId, userData) {
        super();
        super.userId = userId;
        super.side = userData.team.toLowerCase();
        this.control = control;
        this.uc.model = userData.tankBody;
        this.etalonUc.model = userData.tankBody
        this.gun.model = userData.tankHead;
    }
    checkCollision(moveMapFlag){
        let collision = false;
        for (let i = this.speedController; i > 0; i--){
            collision = false;
            this.setPosition(i, true);
            if (!this.checkFrontWay(i)){
                this.setPosition(i, false);
                collision = true;
            }
            if (collision === false) break;
        }
        let deltaX = this.pos.coords.X - this.pos.pastCoords.X;
        let deltaY = this.pos.coords.Y - this.pos.pastCoords.Y;
        this.pos.deltaCoords.X = deltaX;
        this.pos.deltaCoords.Y = deltaY;
        if (moveMapFlag && !collision) {
            let renderX = this.pos.renderCoords.X + this.pos.deltaCoords.X;
            let renderY = this.pos.renderCoords.Y + this.pos.deltaCoords.Y;
            this.pos.renderCoords.X = renderX;
            this.pos.renderCoords.Y = renderY;
        }
    }
    shot(){
        if (this.trigger === true){
            if(this.counter % 2 === 0 && this.reload === this.bullet.speed) {
                this.bullet.move();
            }
            if(this.counter % 2 === 0){
                this.reload++;
            }
            this.kill = this.bullet.fatalHit();
            if(this.kill !== null){
                ++this.kills;
                ++this.killsInGame;
                this.bullet.target = null;
            }
            if (this.reload > 10) {
                this.trigger = false;
                this.bullet.hit = false;
                this.bullet.hitMiss = false;
                this.reload = 0;
            }
        }
    }
    extraMove(moveMapFlag){
        if (this.uc.health > 0){
            if(this.speedController < this.uc.speed && this.counter%2 === 0)
                ++this.speedController;
            this.checkCollision(moveMapFlag);
        }
    }
    checkMapSides(){
        let checkTop = this.map.renderY >=  this.uc.speed;
        let checkTopCenter = this.pos.coords.Y <= this.map.frontHeight - Math.floor(this.control.canvas.height / 2);
        let checkBottom = this.map.renderY <= this.map.frontHeight - this.control.canvas.height - this.uc.speed;
        let checkBottomCenter = this.pos.coords.Y >= Math.floor(this.control.canvas.height / 2);
        let checkLeft = this.map.renderX   >=  this.uc.speed;
        let checkLeftCenter = this.pos.coords.X <= this.map.frontWidth - Math.floor(this.control.canvas.width / 2);
        let checkRight = this.map.renderX <= this.map.frontWidth - this.control.canvas.width - this.uc.speed;
        let checkRightCenter = this.pos.coords.X >= Math.floor(this.control.canvas.width / 2);
        if(this.turn === Turn.top) return checkTop && checkTopCenter;
        if(this.turn === Turn.bottom) return checkBottom && checkBottomCenter;
        if(this.turn === Turn.left) return checkLeft && checkLeftCenter;
        if(this.turn === Turn.right) return checkRight && checkRightCenter;
    }
    correctRenderCoords1(){
        this.map.renderX -= this.pos.deltaCoords.X;
        this.map.renderY -= this.pos.deltaCoords.Y;
        this.targets.forEach(target=>{
            target.bullet.pos.renderCoords.X += this.pos.deltaCoords.X;
            target.bullet.pos.renderCoords.Y += this.pos.deltaCoords.Y;
        });
        this.allies.forEach(ally=>{
            ally.bullet.pos.renderCoords.X += this.pos.deltaCoords.X;
            ally.bullet.pos.renderCoords.Y += this.pos.deltaCoords.Y;
        });
    }
    correctRenderCoords2(){
        this.map.renderX += this.pos.deltaCoords.X;
        this.map.renderY += this.pos.deltaCoords.Y;
        this.targets.forEach(target=>{
            target.bullet.pos.renderCoords.X -= this.pos.deltaCoords.X;
            target.bullet.pos.renderCoords.Y -= this.pos.deltaCoords.Y;
        });
        this.allies.forEach(ally=>{
            ally.bullet.pos.renderCoords.X -= this.pos.deltaCoords.X;
            ally.bullet.pos.renderCoords.Y -= this.pos.deltaCoords.Y;
        });
    }
    move(callback) {
        if (this.checkMapSides()) {
            callback(false);
            if(this.pos.deltaCoords.X < 0 || this.pos.deltaCoords.Y < 0) {
                if (this.turn === Turn.right || this.turn === Turn.bottom) {
                    this.correctRenderCoords1();
                } else {
                    this.correctRenderCoords2();
                }
            }
            else{
                if (this.turn === Turn.right || this.turn === Turn.bottom) {
                    this.correctRenderCoords2();
                } else {
                    this.correctRenderCoords1();
                }
            }
        } else callback(true);
    }
    turnGun(){
        let angleAX = Math.round(this.map.unitWidth/2);
        let angleAY = Math.round(this.map.unitWidth/2);
        let coordsAX = this.pos.renderCoords.X + angleAX;
        let coordsAY = this.pos.renderCoords.Y + angleAY;
        let tgA = (this.control.mouseY - coordsAY) / (this.control.mouseX - coordsAX);
        if(coordsAX < this.control.mouseX)
            this.gun.degree = Math.atan(tgA) * 180 / Math.PI;
        else
            this.gun.degree = Math.atan(tgA) * 180 / Math.PI + 180;
    }
    controlHandling() {
        if(this.uc.health > 0){
            this.turnGun();
            this.counter++;
            if(this.counter > 1000) this.counter = 0;
            switch (this.control.buttonDown) {
                case "ArrowUp":
                case "KeyW":
                    this.turn = Turn.top;
                    this.move((moveMapFlag) => this.extraMove(moveMapFlag));
                    break;
                case "ArrowDown":
                case "KeyS":
                    this.turn = Turn.bottom;
                    this.move((moveMapFlag) => this.extraMove(moveMapFlag));
                    break;
                case "ArrowLeft":
                case "KeyA":
                    this.turn = Turn.left;
                    this.move((moveMapFlag) => this.extraMove(moveMapFlag));
                    break;
                case "ArrowRight":
                case "KeyD":
                    this.turn = Turn.right;
                    this.move((moveMapFlag) => this.extraMove(moveMapFlag));
                    break;
                default: {
                    if (this.speedController > 0 && this.counter % 4 === 0 && this.control.buttonUp !== "") {
                        --this.speedController;
                        this.move((moveMapFlag) => this.checkCollision(moveMapFlag));
                    }
                }
            }
        }
        if(this.control.buttonUp !== ""){
            this.control.buttonDown = "";
            //this.control.buttonUp = "";
        }
        if(this.control.checkMouseDown) {
            if (this.uc.health > 0){
                this.trigger = true;
            }
        }
        if(this.control.checkMouseUp) {
            this.control.checkMouseDown = false;
            this.control.checkMouseUp = false;
        }
    }
}
