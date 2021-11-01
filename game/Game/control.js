export default class Control{
    mouseX = 0;
    mouseY = 0;
    buttonDown = "";
    buttonUp = "";
    checkMouseDown = false;
    checkMouseUp = false;
    constructor(canvas) {
        this.canvas = canvas;
    }
    mouseMove(){
        this.canvas.addEventListener('mousemove', e =>{
            this.mouseX = e.offsetX;
            this.mouseY = e.offsetY;
        });
    }
    mouseDown(){
        this.canvas.addEventListener('mousedown', () =>{
            this.checkMouseDown = true;
        });
    }
    mouseUp(){
        this.canvas.addEventListener('mouseup', () =>{
            this.checkMouseUp = true;
        });
    }
    keyDown(){
        document.addEventListener('keydown', e =>{
            this.buttonDown =  e.code;
            this.buttonUp = "";
        });
    }
    keyUp(){
        document.addEventListener('keyup', e =>{
            this.buttonUp =  e.code;
        });
    }
}
