export default class Map {
    renderX = 0;
    renderY = 0;
    deltaWidth = 0;
    deltaHeight = 0;
    unitWidth = 0;
    unitPerim = 0;
    baseWidth = 280;
    frontWidth = 0;
    frontHeight = 0;
    backWidth = 0;
    backHeight = 0;
    barrier = 1000;
    constructor(canvas, mapImg, unitImg) {
        this.canvas = canvas;
        this.mapImg = mapImg;
        this.unitWidth = unitImg.width;
        this.unitPerim = 4 * unitImg.width;
        this.frontWidth = mapImg.width;
        this.frontHeight = mapImg.height;
        this.backWidth = this.frontWidth + 2 * this.barrier;
        this.backHeight = this.frontHeight + 2 * this.barrier;
    }
    calculateDelta(){
        this.deltaWidth = this.frontWidth - this.canvas.width;
        this.deltaHeight = this.frontHeight - this.canvas.height;
    }
    moveMap(mouseX, mouseY){
        this.calculateDelta();
        if(mouseX <= 10 && this.renderX > 0)
            this.renderX -= 10;
        else if(this.renderX < 0)
            this.renderX = 0;
        if(mouseY <= 10 && this.renderY > 0)
            this.renderY -= 10;
        else if(this.renderY < 0)
            this.renderY = 0;
        if(mouseX >= this.canvas.width - 10 && this.renderX < this.deltaWidth)
            this.renderX += 10;
        else if(this.renderX > this.deltaWidth)
            this.renderX = this.deltaWidth;
        if(mouseY >= this.canvas.height - 10 && this.renderY < this.deltaHeight)
            this.renderY += 10;
        else if(this.renderY > this.deltaHeight)
            this.renderY = this.deltaHeight;
    }
}
