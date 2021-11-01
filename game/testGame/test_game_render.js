import {Turn} from "../Game/helper.js";
export default class Render{
    pic = null;
    canvas = null;
    context = null;
    map = null;
    etalonUnits = [];
    cloneUnits = [];
    uI = 0;
    game = null;
    constructor(pic, canvas, context, game) {
        this.game = game;
        this.map = game.map;
        this.pic = pic;
        this.canvas = canvas;
        this.context = context;
        this.etalonUnits = game.etalonUnits;
        this.cloneUnits = game.cloneUnits;
        this.userId = game.userId;
        this.userIndex = game.uI;
        this.crashDegrees = 0;
        this.userPreparation();
        this.othersPreparation();
    }

    userPreparation(){
        let halfCanvasX = Math.round(this.canvas.width / 2);
        let halfCanvasY = Math.round(this.canvas.height / 2);
        let canvasBehindMap_X = this.cloneUnits[this.uI].pos.coords.X + halfCanvasX >= this.map.frontWidth
        let maP_XminusPlayer_X = this.map.frontWidth - this.cloneUnits[this.uI].pos.coords.X;
        let deltaX = (canvasBehindMap_X) ? maP_XminusPlayer_X : halfCanvasX;
        let canvasBehindMap_Y = this.cloneUnits[this.uI].pos.coords.Y + halfCanvasY >= this.map.frontHeight
        let maP_YminusPlayer_Y = this.map.frontHeight - this.cloneUnits[this.uI].pos.coords.Y;
        let deltaY = (canvasBehindMap_Y) ? maP_YminusPlayer_Y : halfCanvasY;
        if (this.cloneUnits[this.uI].pos.coords.X >= this.canvas.width) {
            this.map.renderX = this.cloneUnits[this.uI].pos.coords.X + deltaX - this.canvas.width;
            this.cloneUnits[this.uI].pos.renderCoords.X = this.cloneUnits[this.uI].pos.coords.X - this.map.renderX;
            this.etalonUnits[this.uI].pos.renderCoords.X = this.cloneUnits[this.uI].pos.coords.X - this.map.renderX;
        } else {
            this.cloneUnits[this.uI].pos.renderCoords.X = this.cloneUnits[this.uI].pos.coords.X;
            this.etalonUnits[this.uI].pos.renderCoords.X = this.etalonUnits[this.uI].pos.coords.X;
        }
        if (this.cloneUnits[this.uI].pos.coords.Y > this.canvas.height) {
            this.map.renderY = this.cloneUnits[this.uI].pos.coords.Y + deltaY - this.canvas.height;
            this.cloneUnits[this.uI].pos.renderCoords.Y = this.cloneUnits[this.uI].pos.coords.Y - this.map.renderY;
            this.etalonUnits[this.uI].pos.renderCoords.Y = this.cloneUnits[this.uI].pos.coords.Y - this.map.renderY;
        } else {
            this.cloneUnits[this.uI].pos.renderCoords.Y = this.cloneUnits[this.uI].pos.coords.Y;
            this.etalonUnits[this.uI].pos.renderCoords.Y = this.etalonUnits[this.uI].pos.coords.Y;
        }
    }
    othersPreparation(){
        for(let i = 0; i < this.cloneUnits.length; ++i){
            if(i !== this.uI ) {
                this.cloneUnits[i].pos.renderCoords.X = this.cloneUnits[i].pos.coords.X - this.cloneUnits[this.uI].map.renderX;
                this.cloneUnits[i].pos.renderCoords.Y = this.cloneUnits[i].pos.coords.Y - this.map.renderY;
                this.cloneUnits[i].bullet.pos.renderCoords.X = this.cloneUnits[i].bullet.pos.coords.X - this.map.renderX;
                this.cloneUnits[i].bullet.pos.renderCoords.Y = this.cloneUnits[i].bullet.pos.coords.Y - this.map.renderY;
            }
        }
        this.map.baseTowers.forEach(tower=>{
           tower.pos.renderCoords.X =  tower.pos.coords.X - this.cloneUnits[this.uI].map.renderX;
           tower.pos.renderCoords.Y =  tower.pos.coords.Y - this.cloneUnits[this.uI].map.renderY;
           tower.bullet.pos.renderCoords.X = tower.bullet.pos.coords.X - this.map.renderX;
           tower.bullet.pos.renderCoords.Y = tower.bullet.pos.coords.Y - this.map.renderY;
        });
        this.map.towers.forEach(tower=>{
            tower.pos.renderCoords.X =  tower.pos.coords.X - this.cloneUnits[this.uI].map.renderX;
            tower.pos.renderCoords.Y =  tower.pos.coords.Y - this.cloneUnits[this.uI].map.renderY;
            tower.bullet.pos.renderCoords.X = tower.bullet.pos.coords.X - this.map.renderX;
            tower.bullet.pos.renderCoords.Y = tower.bullet.pos.coords.Y - this.map.renderY;
        });
        this.map.mobs.forEach(mob=>{
            mob.pos.renderCoords.X =  mob.pos.coords.X - this.cloneUnits[this.uI].map.renderX;
            mob.pos.renderCoords.Y =  mob.pos.coords.Y - this.cloneUnits[this.uI].map.renderY;
            mob.bullet.pos.renderCoords.X = mob.bullet.pos.coords.X - this.map.renderX;
            mob.bullet.pos.renderCoords.Y = mob.bullet.pos.coords.Y - this.map.renderY;
        });
        this.map.redBase.pos.renderCoords.X = this.map.unitWidth * 4 - this.map.renderX;
        this.map.redBase.pos.renderCoords.Y = this.map.unitWidth * 11 - this.map.renderY;
        this.map.blueBase.pos.renderCoords.X = this.map.frontWidth - this.map.unitWidth * 4 - this.map.renderX;
        this.map.blueBase.pos.renderCoords.Y = this.map.unitWidth * 10 - this.map.renderY;
    }
    showUnitModel(cloneUnit){
            let degrees = 0;
            if (cloneUnit.turn === Turn.right) degrees = 0;
            if (cloneUnit.turn === Turn.bottom) degrees = 90;
            if (cloneUnit.turn === Turn.left) degrees = 180;
            if (cloneUnit.turn === Turn.top) degrees = 270;
            this.rotateImage(degrees,
                this.map.unitWidth,
                this.map.unitWidth,
                cloneUnit.pos.renderCoords,
                () => {
                    this.context.drawImage(this.pic.images.get(cloneUnit.uc.model),
                        -Math.floor(this.map.unitWidth / 2),
                        -Math.floor(this.map.unitWidth / 2));
                });
            this.showGunModel(cloneUnit);
    }
    showGunModel(cloneUnit){
        if(cloneUnit.uc.health > 0) {
                this.rotateImage(cloneUnit.gun.degree,
                this.map.unitWidth,
                this.map.unitWidth,
                cloneUnit.pos.renderCoords,
                () => {
                    this.context.drawImage(this.pic.images.get(cloneUnit.gun.model),
                        -Math.floor(this.map.unitWidth / 2),
                        -Math.floor(this.map.unitWidth / 2));
                });
        }
    }
    rotateImage(degrees, width, height, coords, callback){
        this.context.save();
        this.context.translate(
            coords.X + Math.floor(width/2),
            coords.Y + Math.floor(height/2));
        this.context.rotate(degrees * ( Math.PI/180));
        callback();
        this.context.restore();
    }
    //region ----------- Shooting animation -------------
    showShot(cloneUnit){
        this.showBullet(cloneUnit.bullet.degree, cloneUnit);
        this.showShotMoment(cloneUnit.bullet.degree, cloneUnit);
        this.showBoomMoment(cloneUnit.bullet.degree, cloneUnit);
    }
    showBullet(degrees, cloneUnit){
        if(cloneUnit.bullet.speed === 1) {
            this.game.sound.sounds.get(cloneUnit.id).currentTime = 0;
            this.game.sound.sounds.get(cloneUnit.id).play();
        }
        if(cloneUnit.bullet.speed !== 0) {
            let bulletImg = this.pic.images.get(cloneUnit.ammunition[cloneUnit.bulletType].model);
            this.rotateImage(degrees,
                bulletImg.width,
                bulletImg.height,
                cloneUnit.bullet.pos.renderCoords,
                () => {
                    this.context.drawImage(bulletImg,
                        -Math.floor(bulletImg.width / 2),
                        -Math.floor(bulletImg.height / 2));
                });
        }
    }
    showShotMoment(degrees, cloneUnit){
        if(cloneUnit.bullet.speed === 2||cloneUnit.bullet.speed === 3){
            let shotImg = this.pic.images.get(cloneUnit.ammunition[cloneUnit.bulletType].shot_model);
            if(cloneUnit.bullet.speed === 2) {
                cloneUnit.bullet.bulletType.shot_coords.X = cloneUnit.bullet.pos.renderCoords.X
                cloneUnit.bullet.bulletType.shot_coords.Y = cloneUnit.bullet.pos.renderCoords.Y
            }
            this.rotateImage(degrees,
                shotImg.width,
                shotImg.height,
                cloneUnit.bullet.bulletType.shot_coords,
                () => {
                    this.context.drawImage(shotImg,
                        -Math.floor(shotImg.width / 2),
                        -Math.floor(shotImg.height / 2));
                });
        }
    }
    showBoomMoment(degrees, cloneUnit) {
        if (cloneUnit.bullet.hit || cloneUnit.bullet.hitMiss) {
            let boomImg = this.pic.images.get(cloneUnit.ammunition[cloneUnit.bulletType].boom_model);
            cloneUnit.bullet.bulletType.boom_coords.X = cloneUnit.bullet.pos.renderCoords.X;
            cloneUnit.bullet.bulletType.boom_coords.Y = cloneUnit.bullet.pos.renderCoords.Y;
            this.rotateImage(degrees,
                boomImg.width,
                boomImg.height,
                cloneUnit.bullet.bulletType.boom_coords,
                () => {
                    this.context.drawImage(boomImg,
                        -Math.floor(boomImg.width / 2),
                        -Math.floor(boomImg.height / 2));
                });
        }
    }
    //endregion ----------- Shooting animation -------------
    healthArmorBalancer(curValue, etalonValue, width) {
    return curValue * width / etalonValue;
    }
    showArmor(clone){
        if (clone.uc.health > 0) {
            const rectWidth = 6;
            //dfu = distance from unit
            const dfu = 26;
            this.context.fillStyle = "darkOrange";
            let tempArmor = this.healthArmorBalancer(clone.uc.armor, clone.etalonUc.armor, this.map.unitWidth);
            switch (clone.turn) {
                case Turn.right: {
                    this.context.fillRect(clone.pos.renderCoords.X - dfu,
                        clone.pos.renderCoords.Y + this.map.unitWidth - tempArmor, rectWidth, tempArmor);
                    this.context.fillStyle = "rgb(60, 50, 50)";
                    this.context.fillRect(clone.pos.renderCoords.X - dfu,
                       clone.pos.renderCoords.Y, rectWidth, this.map.unitWidth - tempArmor);
                    break;
                }
                case Turn.bottom: {
                    this.context.fillRect(clone.pos.renderCoords.X + this.map.unitWidth - tempArmor,
                        clone.pos.renderCoords.Y - dfu, tempArmor, rectWidth);
                    this.context.fillStyle = "rgb(60, 50, 50)";
                    this.context.fillRect(clone.pos.renderCoords.X,
                        clone.pos.renderCoords.Y - dfu, this.map.unitWidth - tempArmor, rectWidth);
                    break;
                }
                case Turn.left: {
                    this.context.fillRect(clone.pos.renderCoords.X + this.map.unitWidth + dfu,
                        clone.pos.renderCoords.Y + this.map.unitWidth - tempArmor, rectWidth, tempArmor);
                    this.context.fillStyle = "rgb(60, 50, 50)";
                    this.context.fillRect(clone.pos.renderCoords.X + this.map.unitWidth + dfu,
                        clone.pos.renderCoords.Y, rectWidth, this.map.unitWidth - tempArmor);
                    break;
                }
                case Turn.top: {
                    this.context.fillRect(clone.pos.renderCoords.X + this.map.unitWidth - tempArmor,
                        clone.pos.renderCoords.Y + this.map.unitWidth + dfu, tempArmor, rectWidth);
                    this.context.fillStyle = "rgb(60, 50, 50)";
                    this.context.fillRect(clone.pos.renderCoords.X,
                        clone.pos.renderCoords.Y + this.map.unitWidth + dfu,
                        this.map.unitWidth - tempArmor, rectWidth);
                    break;
                }
            }
        }
    }
    showHealth(clone) {
        if (clone.uc.health > 0) {
            const rectWidth = 6;
            //dfu = distance from unit
            const dfu = 20;
            this.context.fillStyle = (clone.side === "Red") ? "darkRed" :
                (clone.side === "Green")? "darkGreen" : "blue";
            let tempHealth = this.healthArmorBalancer(clone.uc.health, clone.etalonUc.health, this.map.unitWidth);
            switch (clone.turn) {
                case Turn.right: {
                    this.context.fillRect(clone.pos.renderCoords.X - dfu,
                        clone.pos.renderCoords.Y + this.map.unitWidth - tempHealth, rectWidth, tempHealth);
                    this.context.fillStyle = "rgb(60, 50, 50)";
                    this.context.fillRect(clone.pos.renderCoords.X - dfu,
                        clone.pos.renderCoords.Y, rectWidth, this.map.unitWidth - tempHealth);
                    break;
                }
                case Turn.bottom: {
                    this.context.fillRect(clone.pos.renderCoords.X + this.map.unitWidth - tempHealth,
                        clone.pos.renderCoords.Y - dfu, tempHealth, rectWidth);
                    this.context.fillStyle = "rgb(60, 50, 50)";
                    this.context.fillRect(clone.pos.renderCoords.X,
                        clone.pos.renderCoords.Y - dfu, this.map.unitWidth - tempHealth, rectWidth);
                    break;
                }
                case Turn.left: {
                    this.context.fillRect(clone.pos.renderCoords.X + this.map.unitWidth + dfu,
                        clone.pos.renderCoords.Y + this.map.unitWidth - tempHealth, rectWidth, tempHealth);
                    this.context.fillStyle = "rgb(60, 50, 50)";
                    this.context.fillRect(clone.pos.renderCoords.X + this.map.unitWidth + dfu,
                        clone.pos.renderCoords.Y, rectWidth, this.map.unitWidth - tempHealth);
                    break;
                }
                case Turn.top: {
                    this.context.fillRect(clone.pos.renderCoords.X + this.map.unitWidth - tempHealth,
                        clone.pos.renderCoords.Y + this.map.unitWidth + dfu, tempHealth, rectWidth);
                    this.context.fillStyle = "rgb(60, 50, 50)";
                    this.context.fillRect(clone.pos.renderCoords.X,
                        clone.pos.renderCoords.Y + this.map.unitWidth + dfu,
                        this.map.unitWidth - tempHealth, rectWidth);
                    break;
                }
            }
        }
    }
    showBaseHealth(clone) {
        if (clone.uc.health > 0) {
            const rectWidth = 12;
            //dfu = distance from unit
            const dfu = 20;
            let tempHealth = this.healthArmorBalancer(clone.uc.health, clone.etalonUc.health, this.map.baseWidth);
            this.context.fillStyle = (clone.side === "Red") ? "darkRed" : "blue";
            if(clone.side === "Red") {
                this.context.fillRect(clone.pos.renderCoords.X - dfu,
                    clone.pos.renderCoords.Y + this.map.baseWidth - tempHealth, rectWidth, tempHealth);
                this.context.fillStyle = "rgb(60, 50, 50)";
                this.context.fillRect(clone.pos.renderCoords.X - dfu,
                    clone.pos.renderCoords.Y, rectWidth, this.map.baseWidth - tempHealth);
            }
            else{
                this.context.fillRect(clone.pos.renderCoords.X + dfu,
                    clone.pos.renderCoords.Y + this.map.baseWidth - tempHealth, rectWidth, tempHealth);
                this.context.fillStyle = "rgb(60, 50, 50)";
                this.context.fillRect(clone.pos.renderCoords.X + dfu,
                    clone.pos.renderCoords.Y, rectWidth, this.map.baseWidth - tempHealth);
            }
        }
    }
    showCrash(clone) {
        if (clone.uc.health <= 0) {
            clone.pos.renderCrashCoords.X = clone.pos.crashCoords.X - this.map.renderX;
            clone.pos.renderCrashCoords.Y = clone.pos.crashCoords.Y - this.map.renderY;
        this.rotateImage(0,
            this.map.unitWidth,
            this.map.unitWidth,
            clone.pos.renderCrashCoords,
            () => {
                this.context.drawImage(this.pic.images.get(clone.uc.model),
                    -Math.floor(this.map.unitWidth/2),
                    -Math.floor(this.map.unitWidth/2));
            });
            ++this.crashDegrees;
            this.rotateImage(this.crashDegrees,
                this.map.unitWidth,
                this.map.unitWidth,
                clone.pos.renderCrashCoords,
                () => {
                    this.context.drawImage(this.pic.images.get("smoke_1"),
                        -Math.floor(this.map.unitWidth/2),
                        -Math.floor(this.map.unitWidth/2));
                });
        }
    }
    isVisible(cloneUnit){
        return !(cloneUnit.pos.renderCoords.X >  this.canvas.width + this.map.unitWidth ||
            cloneUnit.pos.renderCoords.X <  - this.map.unitWidth ||
            cloneUnit.pos.renderCoords.Y >  this.canvas.height + this.map.unitWidth ||
            cloneUnit.pos.renderCoords.X <  - this.map.unitWidth);
    }
    render(){
        if(this.game.counter === 5) {
            this.game.sound.sounds.get('Wind').currentTime = 0;
            this.game.sound.sounds.get('Wind').play();
        }
        //---------------------------------------preparations
        this.othersPreparation();
        if(this.cloneUnits[this.uI].uc.respawnTime === 1) {
            this.map.renderX = 0;
            this.map.renderY = 0;
            this.userPreparation();
        }
        else if(this.cloneUnits[this.uI].uc.health <= 0){
            this.map.moveMap(this.cloneUnits[this.uI].control.mouseX,
                this.cloneUnits[this.uI].control.mouseY);
        }
        //-------------------------------------map
        this.context.drawImage(this.map.mapImg,
            this.map.renderX,
            this.map.renderY,
            this.canvas.width,
            this.canvas.height,
            0, 0,
            this.canvas.width,
            this.canvas.height);
        //-----------------------------------------crash
        this.cloneUnits.forEach(cloneUnit => {
            this.showCrash(cloneUnit);
        });
        //---------------------------------------models
        this.cloneUnits.forEach(cloneUnit => {
            if(cloneUnit.uc.health > 0 && this.isVisible(cloneUnit)) this.showUnitModel(cloneUnit);
        });
        this.map.towers.forEach(tower => {
            if(this.isVisible(tower))this.showUnitModel(tower);
        });
        this.map.baseTowers.forEach(tower => {
            if(this.isVisible(tower))this.showUnitModel(tower);
        });
        this.map.mobs.forEach(mob => {
            if(this.isVisible(mob))this.showUnitModel(mob);
        });
        //----------------------------------------shots
        this.cloneUnits.forEach(cloneUnit => {
            if(cloneUnit.uc.health > 0 && this.isVisible(cloneUnit)) this.showShot(cloneUnit);
        });
        this.map.towers.forEach(tower => {
            if(tower.uc.health > 0 && this.isVisible(tower)) this.showShot(tower);
        });
        this.map.baseTowers.forEach(tower => {
            if(tower.uc.health > 0 && this.isVisible(tower))this.showShot(tower);
        });
        this.map.mobs.forEach(mob => {
            if(mob.uc.health > 0 && this.isVisible(mob))this.showShot(mob);
        });
        //-----------------------------------------health
        this.cloneUnits.forEach((cloneUnit) => {
            if(cloneUnit.uc.health > 0 && this.isVisible(cloneUnit)){
                this.showHealth(cloneUnit);
                this.showArmor(cloneUnit);
            }
        });
        this.map.towers.forEach(tower =>{
            if(this.isVisible(tower))this.showHealth(tower);
        });
        this.map.mobs.forEach(mob =>{
            if(this.isVisible(mob))this.showHealth(mob);
        });
        if(this.isVisible(this.map.redBase))this.showBaseHealth(this.map.redBase);
        if(this.isVisible(this.map.blueBase))this.showBaseHealth(this.map.blueBase);
        this.showUC();
        //-------------------------------------------gameOver
        if(this.game.win || this.game.defeat){
            this.cloneUnits[this.uI].pos.renderCoords.X = this.cloneUnits[this.uI].pos.coords.X - this.map.renderX;
            this.cloneUnits[this.uI].pos.renderCoords.Y = this.cloneUnits[this.uI].pos.coords.Y - this.map.renderY;
            this.cloneUnits[this.uI].bullet.pos.renderCoords.X = this.cloneUnits[this.uI].bullet.pos.coords.X - this.map.renderX;
            this.cloneUnits[this.uI].bullet.pos.renderCoords.Y = this.cloneUnits[this.uI].bullet.pos.coords.Y - this.map.renderY;
            this.map.moveMap(this.cloneUnits[this.uI].control.mouseX,
                this.cloneUnits[this.uI].control.mouseY);
            this.context.fillStyle =  'rgba(60, 50, 50, 0.8)';
            this.context.strokeStyle = 'rgb(20, 20, 20)';
            let X = Math.round(this.canvas.width / 10);
            let Y = Math.round(this.canvas.height / 10);
            let width = X * 8;
            let height = Y * 8;
            let radius = 20;
            this.context.lineJoin = 'round';
            this.context.lineWidth = radius;
            this.context.strokeRect(X + (radius / 2), Y + (radius / 2),
                width - radius, height - radius);
            this.context.fillRect(X + (radius / 2), Y + (radius / 2),
                width - radius, height - radius);
            if(this.game.win) this.winMessage(Y);
            if(this.game.defeat) this.defeatMessage(Y);
        }
    }
    showUC(){
        this.context.fillStyle = "rgb(0, 0, 0)";
        this.context.font =  '20px Palatino Linotype';
        this.context.lineWidth = 2;
        let X = 20, Y = 20;

        this.text(`Level: ${this.cloneUnits[this.uI].uc.level}`, X, Y);
        this.text(`Exp: ${Math.floor(this.cloneUnits[this.uI].uc.experience)} / ${Math.floor(this.cloneUnits[this.uI].experienceToLevel)}`, X, Y * 2);
        this.text(`Health: ${Math.floor(this.cloneUnits[this.uI].uc.health)} / ${Math.floor(this.cloneUnits[this.uI].etalonUc.health)}`, X, Y * 3);
        this.text(`Armor: ${Math.floor(this.cloneUnits[this.uI].uc.armor)} / ${Math.floor(this.cloneUnits[this.uI].etalonUc.armor)}`, X, Y * 4);
        this.text(`Speed: ${Math.floor(this.cloneUnits[this.uI].uc.speed)} / ${Math.floor(this.cloneUnits[this.uI].etalonUc.speed)}`, X, Y * 5);
        this.text(`Power: ${Math.floor(this.cloneUnits[this.uI].uc.shotPower)} / ${Math.floor(this.cloneUnits[this.uI].etalonUc.shotPower)}`, X, Y * 6);
    }
    winMessage(Y){
        this.context.textAlign = "center";
        let center = Math.round(this.canvas.width / 2);
        this.context.fillStyle = "rgb(255, 255, 255)";
        this.context.font = '48px Palatino Linotype';
        this.context.lineWidth = 5;
        this.text('PERFECT VICTORY', center, Y * 2);
        this.context.font = '36px Palatino Linotype';
        this.context.lineWidth = 3;
        this.text('Congratulations! Your awards / achievements:', center, Y * 3);
        this.message(Y);
    }
    defeatMessage(Y){
        this.context.textAlign = 'center';
        let center = Math.round(this.canvas.width / 2);
        this.context.fillStyle = 'rgb(255, 255, 255)';
        this.context.font = '48px Palatino Linotype';
        this.context.lineWidth = 5;
        this.text('UNFORTUNATE DEFEAT', center, Y * 2);
        this.context.font = '36px Palatino Linotype';
        this.context.lineWidth = 3;
        this.text('Your awards / achievements:', center, Y * 3);
        this.message(Y);
    }
    message(Y) {
        let center = Math.round(this.canvas.width / 2);
        let y = Math.round(Y / 2);
        this.context.lineWidth = 3;
        this.context.font = '28px Palatino Linotype';
        this.text(`Money: +${this.game.bonus}`, center, Y * 4 + y);
        this.text(`Kills in game: ${this.cloneUnits[this.uI].killsInGame}`, center, Y * 4 + y * 2);
        this.text(`Level in game: ${this.cloneUnits[this.uI].uc.level}`, center, Y * 4 + y * 3);
        this.text(`Total kills: ${this.etalonUnits[this.uI].kills}`, center, Y * 4 + y * 4);
        this.text(`Wins: ${this.etalonUnits[this.uI].wins}`, center, Y * 4 + y * 5);
        this.text(`Defeats: ${this.etalonUnits[this.uI].defeats}`, center, Y * 4 + y * 6);
        this.text(`Battles: ${this.etalonUnits[this.uI].battles}`, center, Y * 4 + y * 7);
    }
    text(text, X, Y){
        this.context.strokeText(text, X, Y, this.canvas.width);
        this.context.fillText(text, X, Y, this.canvas.width);
    }
}
