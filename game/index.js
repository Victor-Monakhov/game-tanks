window._ = require('lodash');
import TestGameMap from "./Game/Maps/test_game_map.js";
import Pictures from "./Game/image_container.js";
import TestGame from "./testGame/test_game.js";
import Tank from "./Game/tank.js";
import Render from "./testGame/test_game_render.js";
import Control from "./Game/control.js";
import TankBot from "./Game/tank_bot.js";
import {Coords} from "./Game/helper.js";

export class Game{
    map;
    game;
    control;
    units;
    render;
    constructor(canvas){
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");
        this.control = new Control(canvas);
        this.pictures = new Pictures();
        this.start = new Date().getTime();
        this.fps = 0;
    }
        draw() {
            this.game.run();
            setTimeout(() => this.render.render(),0);
            //render.render();
            let end = new Date().getTime();
            this.fps++;
            if(end - this.start  >= 1000){
                console.log(this.fps);
                this.start = end;
                this.fps = 0;
            }
            //setTimeout(()=> draw(),0);
            requestAnimationFrame(this.draw.bind(this));
        }
        run(){
        this.pictures.allUploaded(() => {
            this.map = new TestGameMap(this.canvas, this.pictures.images.get("testGameMap"), this.pictures.images.get("T_2"));
            this.canvas.style.cursor = this.pictures.images.get('cursor');
            this.units = [new Tank(this.control, "user", "Red"),
                new TankBot("Red", "T_1", 30, 30, 5, 1, 200, 600,
                    {model: 'gun_1', degree: 0, coords: new Coords(0,0)}),
                new TankBot("Red", "T_1", 30, 30, 5, 1, 200, 600,
                    {model: 'gun_1', degree: 0, coords: new Coords(0,0)}),
                new TankBot("Red", "T_1", 30, 30, 5, 1, 200, 600,
                    {model: 'gun_1', degree: 0, coords: new Coords(0,0)}),
                new TankBot("Blue", "T_3", 30, 30, 5, 1, 200, 600,
                    {model: 'gun_3', degree: 0, coords: new Coords(0,0)}),
                new TankBot("Blue", "T_3", 30, 30, 5, 1, 200, 600,
                    {model: 'gun_3', degree: 0, coords: new Coords(0,0)}),
                new TankBot("Blue", "T_3", 30, 30, 5, 1, 200, 600,
                    {model: 'gun_3', degree: 0, coords: new Coords(0,0)}),
                new TankBot("Blue", "T_3", 30, 30, 5, 1, 200, 600,
                    {model: 'gun_3', degree: 0, coords: new Coords(0,0)})];
            this.game = new TestGame(this.map, this.units, "user");
            this.render = new Render(this.pictures, this.canvas, this.context, this.game);
            //setInterval(()=>this.draw(), 0);
            this.draw();
        });
    }
}




