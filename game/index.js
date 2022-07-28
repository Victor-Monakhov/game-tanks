window._ = require('lodash'); //comment this line for testing
// import {  // use for testing
//     IDemoSettingsTest1,
//     IDemoSettingsTest2,
//     IDemoSettingsTest3,
//     IDemoSettingsTest4,
//     IDemoSettingsTest5,
//     IDemoSettingsTest6,
//     IDemoSettingsTest7,
//     IDemoSettingsTest8
//  } from "../test_lib/data.js";
import TestGameMap from "./Game/Maps/test_game_map.js";
import Pictures from "./Game/image_container.js";
import TestGame from "./testGame/test_game.js";
import Tank from "./Game/tank.js";
import Render from "./testGame/test_game_render.js";
import Control from "./Game/control.js";
import TankBot from "./Game/tank_bot.js";
import {Coords} from "./Game/helper.js";

// use for testing
// document.getElementById('btn0').onclick = () => new Game(document.querySelector('canvas'), new IDemoSettingsTest1()).run();
// document.getElementById('btn1').onclick = () => new Game(document.querySelector('canvas'), new IDemoSettingsTest2()).run();
// document.getElementById('btn2').onclick = () => new Game(document.querySelector('canvas'), new IDemoSettingsTest3()).run();
// document.getElementById('btn3').onclick = () => new Game(document.querySelector('canvas'), new IDemoSettingsTest4()).run();
// document.getElementById('btn4').onclick = () => new Game(document.querySelector('canvas'), new IDemoSettingsTest5()).run();
// document.getElementById('btn5').onclick = () => new Game(document.querySelector('canvas'), new IDemoSettingsTest6()).run();
// document.getElementById('btn6').onclick = () => new Game(document.querySelector('canvas'), new IDemoSettingsTest7()).run();
// document.getElementById('btn7').onclick = () => new Game(document.querySelector('canvas'), new IDemoSettingsTest8()).run();

export class IDemoSettings {
    position = 0;
    team = 'red';
    tankHead = 'gun_1';
    tankBody = 'T_1';
}

export class Game{
    map;
    game;
    control;
    units;
    render;
    constructor(canvas, settings = new IDemoSettings()){
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");
        this.control = new Control(canvas);
        this.pictures = new Pictures();
        this.start = new Date().getTime();
        this.fps = 0;
        this.settings = settings;
    }

    draw() {
        this.game.run();
        setTimeout(() => this.render.render(),0);
        let end = new Date().getTime();
        this.fps++;
        if(end - this.start  >= 1000){
            console.log(this.fps);
            this.start = end;
            this.fps = 0;
        }
        requestAnimationFrame(this.draw.bind(this));
    }

    run(){
    this.pictures.allUploaded(() => {
        this.map = new TestGameMap(this.canvas, this.pictures.images.get("testGameMap"), this.pictures.images.get("T_2"));
        this.canvas.style.cursor = this.pictures.images.get('cursor');
        this.units = this.getUnits();
        this.game = new TestGame(this.map, this.units, "user");
        this.render = new Render(this.pictures, this.canvas, this.context, this.game);
        this.draw();});
    }

    getUnits(){
        const userTank = () => new Tank(this.control, "user", this.settings);
        const redTankBot = () => new TankBot("Red", "T_1", 30, 30, 5, 1, 200, 600,
                            {model: 'gun_1', degree: 0, coords: new Coords(0,0)});
        const blueTankBot = () => new TankBot("Blue", "T_3", 30, 30, 5, 1, 200, 600,
                            {model: 'gun_3', degree: 0, coords: new Coords(0,0)});
        const position = (this.settings.team === 'red') ?
                            this.settings.position :
                            this.settings.position + 4;
        const units = [redTankBot(), redTankBot(), redTankBot(), redTankBot(), blueTankBot(), blueTankBot(), blueTankBot(), blueTankBot()];
        units.splice(position, 1, userTank());
        return units;
    }
}





