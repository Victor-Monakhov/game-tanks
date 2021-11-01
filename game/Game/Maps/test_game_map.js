import Map from "../map.js";
import {Coords, Turn, BackId, MapElement} from "../helper.js";
import TankBot from "../tank_bot.js";

export default class TestGameMap extends Map{
    unitsCount = 8;
    towersCount = 18;
    mobsCount = 6;
    backArray = [];
    unitsCoords = [];
    startUnitsTurn = [];
    baseTowers = [];
    towers = [];
    mobs = [];
    etalonMobs = [];
    redBase = null;
    blueBase = null;
    etalonTower = null;
    backId = null;
    constructor(canvas, mapImg, unitImg) {
        super(canvas, mapImg, unitImg);
        this.backId = new BackId(this.unitsCount, this.towersCount, this.mobsCount);
        const redGun = {model: 'gun_1', degree:0};
        const blueGun = {model: 'gun_3', degree:0};
        const mobGun = {model: 'gun_5', degree:0};
        this.redBase = new TankBot("Red", "", 200, 0);
        this.redBase.tower1 = new TankBot("Red", "tower_1", 100, 0, 0, 3, 350, 0, _.cloneDeep(redGun));
        this.redBase.tower2 = new TankBot("Red", "tower_1", 100, 0, 0, 3, 350, 0, _.cloneDeep(redGun));
        this.blueBase = new TankBot("Blue", "", 200, 0);
        this.blueBase.tower1 = new TankBot("Blue", "tower_2", 100, 0, 0, 3, 350, 0, _.cloneDeep(blueGun));
        this.blueBase.tower2 = new TankBot("Blue", "tower_2", 100, 0, 0, 3, 350, 0, _.cloneDeep(blueGun));
        //this.etalonRedBase = _.cloneDeep(this.redBase);
        //this.etalonBlueBase = _.cloneDeep(this.blueBase);
        this.etalonTower = new TankBot("", "", 100, 0, 0, 3, 350);
        //this.etalonMob = new TankBot("","", 15, 0, 0, 250);
        const mapWidthDefect = Math.round(this.unitWidth*2/3);
        const mapHeightDefect = Math.round(this.unitWidth/3);
        const halfUnit = Math.round(this.unitWidth/2);
        this.unitsCoords = [
            new Coords(this.unitWidth * 3 - halfUnit,
                this.frontHeight - this.unitWidth * 12 - halfUnit),
            new Coords(this.unitWidth * 3 - halfUnit
                , this.frontHeight - this.unitWidth * 9 - halfUnit),
            new Coords(this.unitWidth * 9 - halfUnit,
                this.frontHeight - this.unitWidth * 3 - halfUnit),
            new Coords(this.unitWidth * 12 - halfUnit,
                this.frontHeight - this.unitWidth * 3 - halfUnit),
            new Coords(this.frontWidth - this.unitWidth * 3 - halfUnit,
                this.frontHeight - this.unitWidth * 13 + halfUnit),
            new Coords(this.frontWidth - this.unitWidth * 3 - halfUnit,
                this.frontHeight - this.unitWidth * 10 + halfUnit),
            new Coords(this.frontWidth - this.unitWidth * 9 - halfUnit,
                this.frontHeight - this.unitWidth * 3 - halfUnit),
            new Coords(this.frontWidth - this.unitWidth * 12 - halfUnit,
                this.frontHeight - this.unitWidth * 3 - halfUnit),
        ];
        this.startUnitsTurn = [
            Turn.right,
            Turn.right,
            Turn.top,
            Turn.top,
            Turn.left,
            Turn.left,
            Turn.top,
            Turn.top,
        ];
        this.baseTowers = [
            this.redBase.tower1,
            this.redBase.tower2,
            this.blueBase.tower1,
            this.blueBase.tower2,
        ];
        this.redBase.tower1.pos.coords = new Coords(this.unitWidth * 9 + halfUnit,
            this.unitWidth * 10 + halfUnit);
        this.redBase.tower2.pos.coords = new Coords(this.unitWidth *  9 + halfUnit,
            this.unitWidth * 15 + halfUnit);
        this.blueBase.tower1.pos.coords = new Coords(this.frontWidth - this.unitWidth * 11 + halfUnit,
            this.unitWidth * 9 + halfUnit);
        this.blueBase.tower2.pos.coords = new Coords(this.frontWidth - this.unitWidth * 11 + halfUnit,
            this.unitWidth * 14 + halfUnit);
        for(let i = 0; i < 9; ++i){
            this.towers.push(new TankBot("Red", "tower_1", 100, 0, 0, 3, 350, 0, _.cloneDeep(redGun)));
        }
        for(let i = 0; i < 9; ++i){
            this.towers.push(new TankBot("Blue", "tower_2", 100, 0, 0, 3, 350, 0,  _.cloneDeep(blueGun)));
        }
        this.towersCoords = [
            //red towers
            new Coords(this.unitWidth * 16, this.unitWidth * 8),
            new Coords(this.unitWidth * 15, this.unitWidth * 4),
            new Coords(this.unitWidth * 17, this.unitWidth * 14),
            new Coords(this.unitWidth * 17, this.unitWidth * 18),
            new Coords(this.unitWidth * 16, this.unitWidth * 24 + mapHeightDefect),
            new Coords(this.unitWidth * 15, this.unitWidth * 28 + mapHeightDefect),
            new Coords(this.unitWidth * 27, this.unitWidth * 2),
            new Coords(this.unitWidth * 28, this.unitWidth * 15),
            new Coords(this.unitWidth * 27, this.frontHeight - this.unitWidth * 3),
            //blue towers
            new Coords(this.frontWidth - this.unitWidth * 16, this.unitWidth * 4),
            new Coords(this.frontWidth - this.unitWidth * 17, this.unitWidth * 8),
            new Coords(this.frontWidth - this.unitWidth * 18, this.unitWidth * 14),
            new Coords(this.frontWidth - this.unitWidth * 18, this.unitWidth * 18),
            new Coords(this.frontWidth - this.unitWidth * 17, this.unitWidth * 24 + mapHeightDefect),
            new Coords(this.frontWidth - this.unitWidth * 16, this.unitWidth * 28 + mapHeightDefect),
            new Coords(this.frontWidth - this.unitWidth * 28, this.unitWidth * 2),
            new Coords(this.frontWidth - this.unitWidth * 29, this.unitWidth * 17),
            new Coords(this.frontWidth - this.unitWidth * 28, this.frontHeight - this.unitWidth * 3),
        ];
        for(let i = 0; i < 6; ++i){
            this.mobs.push(new TankBot("Green", "tower_3", 15, 0, 0, 3, 250, 1000, _.cloneDeep(mobGun)));
            this.etalonMobs.push(new TankBot("Green", "tower_3", 15, 0, 0, 3, 250, 1000, _.cloneDeep(mobGun)));
        }
        this.mobsCoords = [
            new Coords(this.unitWidth * 24 + halfUnit, this.unitWidth * 10 + halfUnit),
            new Coords(this.unitWidth * 24 + halfUnit, this.unitWidth * 21),
            new Coords(this.unitWidth * 23 + halfUnit, this.unitWidth * 24 + halfUnit),
            new Coords(this.frontWidth - this.unitWidth * 25 - halfUnit, this.unitWidth * 9 + halfUnit),
            new Coords(this.frontWidth - this.unitWidth * 25 - halfUnit, this.unitWidth * 20),
            new Coords(this.frontWidth - this.unitWidth * 24 - halfUnit, this.unitWidth * 24),
        ];
        this.mapInit();
        //this.backRespawnInit();
        //this.backBasesInit();
    }
    mapInit(){
        const mapWidthDefect = Math.round(this.unitWidth*2/3);
        const mapHeightDefect = Math.round(this.unitWidth/3);
        /**
         * left corners walls--------------------------------------------------------
         */
        this.backArray.push(new MapElement(
            0, 0, 7 * this.unitWidth, 5 * this.unitWidth, this.backId.wall
        ));
        this.backArray.push(new MapElement(
            0,this.frontHeight - 8 * this.unitWidth,
            4 * this.unitWidth, 8 * this.unitWidth, this.backId.wall
        ));
        this.backArray.push(new MapElement(
            4 * this.unitWidth,this.frontHeight - 6 * this.unitWidth,
             this.unitWidth, 6 * this.unitWidth, this.backId.wall
        ));
        this.backArray.push(new MapElement(
            5 * this.unitWidth,this.frontHeight - 5 * this.unitWidth,
            this.unitWidth, 5 * this.unitWidth, this.backId.wall
        ));
        this.backArray.push(new MapElement(
            6 * this.unitWidth,this.frontHeight - 4 * this.unitWidth,
            2 * this.unitWidth, 4 * this.unitWidth, this.backId.wall
        ));
        /**
         * left wall--------------------------------------------------------
         */
        this.backArray.push(new MapElement(
            0,5 * this.unitWidth,
            2 * this.unitWidth, this.frontHeight - 8 * this.unitWidth, this.backId.wall
        ));
        this.backArray.push(new MapElement(
            2 * this.unitWidth,this.frontHeight - 11 * this.unitWidth,
            2 * this.unitWidth, this.unitWidth, this.backId.wall
        ));
        this.backArray.push(new MapElement(
            2 * this.unitWidth,5 * this.unitWidth,
            2 * this.unitWidth, 15 * this.unitWidth + mapHeightDefect, this.backId.wall
        ));
        /**
         * left top wall--------------------------------------------------------
         */
        this.backArray.push(new MapElement(
            7 * this.unitWidth,0 ,
            22 * this.unitWidth, 2 * this.unitWidth, this.backId.wall
        ));
        this.backArray.push(new MapElement(
            10 * this.unitWidth,2 * this.unitWidth ,
            10 * this.unitWidth, this.unitWidth, this.backId.wall
        ));
        this.backArray.push(new MapElement(
            10 * this.unitWidth,3 * this.unitWidth ,
            8 * this.unitWidth, this.unitWidth, this.backId.wall
        ));
        /**
         * left bottom wall--------------------------------------------------------
         */
        this.backArray.push(new MapElement(
            8 * this.unitWidth,this.frontHeight - 2 * this.unitWidth ,
            21 * this.unitWidth, 2 * this.unitWidth, this.backId.wall
        ));
        this.backArray.push(new MapElement(
            10 * this.unitWidth,this.frontHeight - 4 * this.unitWidth ,
             this.unitWidth, 2 * this.unitWidth, this.backId.wall
        ));
        this.backArray.push(new MapElement(
            13 * this.unitWidth,this.frontHeight - 3 * this.unitWidth ,
            7 * this.unitWidth,  this.unitWidth, this.backId.wall
        ));
        this.backArray.push(new MapElement(
            13 * this.unitWidth,this.frontHeight - 4 * this.unitWidth ,
            5 * this.unitWidth,  this.unitWidth, this.backId.wall
        ));
        /**
         * left top center wall--------------------------------------------------------
         */
        this.backArray.push(new MapElement(
            17 * this.unitWidth,9 * this.unitWidth ,
            4 * this.unitWidth,  5 * this.unitWidth, this.backId.wall
        ));
        this.backArray.push(new MapElement(
            20 * this.unitWidth,6 * this.unitWidth ,
            6 * this.unitWidth,  this.unitWidth, this.backId.wall
        ));
        this.backArray.push(new MapElement(
            23 * this.unitWidth,7 * this.unitWidth ,
            this.unitWidth,  8 * this.unitWidth, this.backId.wall
        ));
        this.backArray.push(new MapElement(
            24 * this.unitWidth,7 * this.unitWidth ,
            2 * this.unitWidth,  3 * this.unitWidth, this.backId.wall
        ));
        this.backArray.push(new MapElement(
            24 * this.unitWidth,12 * this.unitWidth ,
            2 * this.unitWidth,  3 * this.unitWidth, this.backId.wall
        ));
        this.backArray.push(new MapElement(
            25 * this.unitWidth,10 * this.unitWidth ,
             this.unitWidth,  2 * this.unitWidth, this.backId.closeRoad
        ));
        this.backArray.push(new MapElement(
            28 * this.unitWidth,6 * this.unitWidth ,
            this.unitWidth,  3 * this.unitWidth, this.backId.wall
        ));
        this.backArray.push(new MapElement(
            28 * this.unitWidth,11 * this.unitWidth ,
            this.unitWidth,  4 * this.unitWidth, this.backId.wall
        ));
        /**
         * left bottom center wall--------------------------------------------------------
         */
        this.backArray.push(new MapElement(
            17 * this.unitWidth,this.frontHeight - 14 * this.unitWidth - mapHeightDefect ,
            4 * this.unitWidth,  5 * this.unitWidth + mapHeightDefect, this.backId.wall
        ));
        this.backArray.push(new MapElement(
            23 * this.unitWidth,this.frontHeight - 14 * this.unitWidth - mapHeightDefect ,
            3 * this.unitWidth, this.unitWidth, this.backId.wall
        ));
        this.backArray.push(new MapElement(
            23 * this.unitWidth,this.frontHeight - 13 * this.unitWidth - mapHeightDefect ,
            this.unitWidth, 4 * this.unitWidth, this.backId.wall
        ));
        this.backArray.push(new MapElement(
            24 * this.unitWidth,this.frontHeight - 10 * this.unitWidth - mapHeightDefect ,
            2 * this.unitWidth, this.unitWidth, this.backId.wall
        ));
        this.backArray.push(new MapElement(
            25 * this.unitWidth,this.frontHeight - 13 * this.unitWidth - mapHeightDefect ,
            this.unitWidth, 3 * this.unitWidth, this.backId.closeRoad
        ));
        this.backArray.push(new MapElement(
            25 * this.unitWidth,this.frontHeight - 9 * this.unitWidth - mapHeightDefect ,
            this.unitWidth, 3 * this.unitWidth + mapHeightDefect, this.backId.wall
        ));
        this.backArray.push(new MapElement(
            20 * this.unitWidth,this.frontHeight - 7 * this.unitWidth,
            5 * this.unitWidth, this.unitWidth, this.backId.wall
        ));
        this.backArray.push(new MapElement(
            23 * this.unitWidth,this.frontHeight - 9 * this.unitWidth - mapHeightDefect,
            this.unitWidth, 2 * this.unitWidth + mapHeightDefect, this.backId.closeRoad
        ));
        this.backArray.push(new MapElement(
            28 * this.unitWidth,this.frontHeight - 15 * this.unitWidth - mapHeightDefect,
            this.unitWidth, 4 * this.unitWidth, this.backId.wall
        ));
        this.backArray.push(new MapElement(
            28 * this.unitWidth,this.frontHeight - 9 * this.unitWidth - mapHeightDefect,
            this.unitWidth, 3 * this.unitWidth + mapHeightDefect, this.backId.wall
        ));
        /**
         * right corner wall--------------------------------------------------------
         */
        this.backArray.push(new MapElement(
            this.frontWidth - 7 * this.unitWidth,0,
            7 * this.unitWidth, 5 * this.unitWidth, this.backId.wall
        ));
        this.backArray.push(new MapElement(
            this.frontWidth - 4 * this.unitWidth,this.frontHeight - 8 * this.unitWidth,
            4 * this.unitWidth, 8 * this.unitWidth, this.backId.wall
        ));
        this.backArray.push(new MapElement(
            this.frontWidth - 5 * this.unitWidth,this.frontHeight - 6 * this.unitWidth,
            this.unitWidth, 6 * this.unitWidth, this.backId.wall
        ));
        this.backArray.push(new MapElement(
            this.frontWidth - 6 * this.unitWidth,this.frontHeight - 5 * this.unitWidth,
            this.unitWidth, 5 * this.unitWidth, this.backId.wall
        ));
        this.backArray.push(new MapElement(
            this.frontWidth - 8 * this.unitWidth,this.frontHeight - 4 * this.unitWidth,
            2 * this.unitWidth, 4 * this.unitWidth, this.backId.wall
        ));
        /**
         * right wall--------------------------------------------------------
         */
        this.backArray.push(new MapElement(
            this.frontWidth - 2 * this.unitWidth, 5 * this.unitWidth,
            2 * this.unitWidth, 20 * this.unitWidth + mapHeightDefect, this.backId.wall
        ));
        this.backArray.push(new MapElement(
            this.frontWidth - 4 * this.unitWidth, this.frontHeight - 11 * this.unitWidth,
            2 * this.unitWidth, this.unitWidth, this.backId.wall
        ));
        this.backArray.push(new MapElement(
            this.frontWidth - 4 * this.unitWidth, 5 * this.unitWidth,
            2 * this.unitWidth, 15 * this.unitWidth + mapHeightDefect, this.backId.wall
        ));
        /**
         * right top wall--------------------------------------------------------
         */
        this.backArray.push(new MapElement(
            this.frontWidth - 29 * this.unitWidth, 0,
            22 * this.unitWidth, 2 * this.unitWidth, this.backId.wall
        ));
        this.backArray.push(new MapElement(
            this.frontWidth - 20 * this.unitWidth, 2 * this.unitWidth,
            10 * this.unitWidth, this.unitWidth, this.backId.wall
        ));
        this.backArray.push(new MapElement(
            this.frontWidth - 18 * this.unitWidth, 3 * this.unitWidth,
            8 * this.unitWidth, this.unitWidth, this.backId.wall
        ));
        /**
         * right bottom wall--------------------------------------------------------
         */
        this.backArray.push(new MapElement(
            this.frontWidth - 29 * this.unitWidth, this.frontHeight - 2 * this.unitWidth,
            21 * this.unitWidth, 2 * this.unitWidth, this.backId.wall
        ));
        this.backArray.push(new MapElement(
            this.frontWidth - 21 * this.unitWidth, this.frontHeight - 3 * this.unitWidth,
            8 * this.unitWidth, this.unitWidth, this.backId.wall
        ));
        this.backArray.push(new MapElement(
            this.frontWidth - 18 * this.unitWidth, this.frontHeight - 4 * this.unitWidth,
            5 * this.unitWidth, this.unitWidth, this.backId.wall
        ));
        this.backArray.push(new MapElement(
            this.frontWidth - 11 * this.unitWidth, this.frontHeight - 4 * this.unitWidth,
            this.unitWidth, 2 * this.unitWidth, this.backId.wall
        ));
        /**
         * right top center--------------------------------------------------------
         */
        this.backArray.push(new MapElement(
            this.frontWidth - 21 * this.unitWidth, 9 * this.unitWidth,
            4 * this.unitWidth,  5 * this.unitWidth, this.backId.wall
        ));
        this.backArray.push(new MapElement(
            this.frontWidth - 26 * this.unitWidth, 6 * this.unitWidth,
            6 * this.unitWidth,  this.unitWidth, this.backId.wall
        ));
        this.backArray.push(new MapElement(
            this.frontWidth - 26 * this.unitWidth, 7 * this.unitWidth,
            3 * this.unitWidth,  2 * this.unitWidth, this.backId.wall
        ));
        this.backArray.push(new MapElement(
            this.frontWidth - 24 * this.unitWidth, 9 * this.unitWidth,
            this.unitWidth,  2 * this.unitWidth, this.backId.wall
        ));
        this.backArray.push(new MapElement(
            this.frontWidth - 26 * this.unitWidth, 11 * this.unitWidth,
            3 * this.unitWidth,  3 * this.unitWidth, this.backId.wall
        ));
        this.backArray.push(new MapElement(
            this.frontWidth - 26 * this.unitWidth, 9 * this.unitWidth,
            this.unitWidth,  2 * this.unitWidth, this.backId.closeRoad
        ));
        this.backArray.push(new MapElement(
            this.frontWidth - 29 * this.unitWidth, 6 * this.unitWidth,
            this.unitWidth,  3 * this.unitWidth, this.backId.wall
        ));
        this.backArray.push(new MapElement(
            this.frontWidth - 29 * this.unitWidth, 11 * this.unitWidth,
            this.unitWidth,  4 * this.unitWidth, this.backId.wall
        ));
        /**
         * right bottom center--------------------------------------------------------
         */
        this.backArray.push(new MapElement(
            this.frontWidth - 21 * this.unitWidth, this.frontHeight - 14 * this.unitWidth - mapHeightDefect,
            4 * this.unitWidth,  5 * this.unitWidth + mapHeightDefect, this.backId.wall
        ));
        this.backArray.push(new MapElement(
            this.frontWidth - 26 * this.unitWidth, this.frontHeight - 15 * this.unitWidth - mapHeightDefect,
            3 * this.unitWidth,  this.unitWidth, this.backId.wall
        ));
        this.backArray.push(new MapElement(
            this.frontWidth - 24 * this.unitWidth, this.frontHeight - 14 * this.unitWidth - mapHeightDefect,
            this.unitWidth,  4 * this.unitWidth, this.backId.wall
        ));
        this.backArray.push(new MapElement(
            this.frontWidth - 26 * this.unitWidth, this.frontHeight - 11 * this.unitWidth - mapHeightDefect,
            2 * this.unitWidth,  this.unitWidth, this.backId.wall
        ));
        this.backArray.push(new MapElement(
            this.frontWidth - 26 * this.unitWidth, this.frontHeight - 10 * this.unitWidth - mapHeightDefect,
             this.unitWidth,  4 * this.unitWidth + mapHeightDefect, this.backId.wall
        ));
        this.backArray.push(new MapElement(
            this.frontWidth - 25 * this.unitWidth, this.frontHeight - 7 * this.unitWidth,
            5 * this.unitWidth,   this.unitWidth , this.backId.wall
        ));
        this.backArray.push(new MapElement(
            this.frontWidth - 26 * this.unitWidth, this.frontHeight - 14 * this.unitWidth - mapHeightDefect,
            this.unitWidth,   2 * this.unitWidth , this.backId.closeRoad
        ));
        this.backArray.push(new MapElement(
            this.frontWidth - 24 * this.unitWidth, this.frontHeight - 10 * this.unitWidth - mapHeightDefect,
            this.unitWidth,   3 * this.unitWidth + mapHeightDefect , this.backId.closeRoad
        ));
        this.backArray.push(new MapElement(
            this.frontWidth - 29 * this.unitWidth, this.frontHeight - 15 * this.unitWidth - mapHeightDefect,
            this.unitWidth,   4 * this.unitWidth , this.backId.wall
        ));
        this.backArray.push(new MapElement(
            this.frontWidth - 29 * this.unitWidth, this.frontHeight - 9 * this.unitWidth - mapHeightDefect,
            this.unitWidth,   3 * this.unitWidth + mapHeightDefect , this.backId.wall
        ));
        /**
         * river--------------------------------------------------------
         */
        this.backArray.push(new MapElement(
            29 * this.unitWidth, 0,
            8 * this.unitWidth + mapWidthDefect,   3 * this.unitWidth , this.backId.water
        ));
        this.backArray.push(new MapElement(
            29 * this.unitWidth, 6 * this.unitWidth,
            8 * this.unitWidth + mapWidthDefect,   3 * this.unitWidth , this.backId.water
        ));
        this.backArray.push(new MapElement(
            29 * this.unitWidth, 11 * this.unitWidth,
            8 * this.unitWidth + mapWidthDefect,   4 * this.unitWidth , this.backId.water
        ));
        this.backArray.push(new MapElement(
            29 * this.unitWidth, 18 * this.unitWidth,
            8 * this.unitWidth + mapWidthDefect,   4 * this.unitWidth , this.backId.water
        ));
        this.backArray.push(new MapElement(
            29 * this.unitWidth, 24 * this.unitWidth,
            8 * this.unitWidth + mapWidthDefect,   3 * this.unitWidth + mapHeightDefect, this.backId.water
        ));
        this.backArray.push(new MapElement(
            29 * this.unitWidth, 30 * this.unitWidth + mapHeightDefect,
            8 * this.unitWidth + mapWidthDefect,   3 * this.unitWidth, this.backId.water
        ));
        /**
         * sand--------------------------------------------------------
         */
        this.backArray.push(new MapElement(
            29 * this.unitWidth, 9 * this.unitWidth,
            9 * this.unitWidth + mapWidthDefect,   2 * this.unitWidth, this.backId.sand
        ));
        this.backArray.push(new MapElement(
            29 * this.unitWidth, 22 * this.unitWidth,
            9 * this.unitWidth + mapWidthDefect,   2 * this.unitWidth, this.backId.sand
        ));
        /**
         * units home--------------------------------------------------------
         */
        this.backArray.push(new MapElement(
            2 * this.unitWidth, this.frontHeight - 13 * this.unitWidth,
            2 * this.unitWidth,   2 * this.unitWidth, this.backId.homes[0]
        ));
        this.backArray.push(new MapElement(
            2 * this.unitWidth, this.frontHeight - 10 * this.unitWidth,
            2 * this.unitWidth,   2 * this.unitWidth, this.backId.homes[1]
        ));
        this.backArray.push(new MapElement(
            8 * this.unitWidth, this.frontHeight - 4 * this.unitWidth,
            2 * this.unitWidth,   2 * this.unitWidth, this.backId.homes[2]
        ));
        this.backArray.push(new MapElement(
            11 * this.unitWidth, this.frontHeight - 4 * this.unitWidth,
            2 * this.unitWidth,   2 * this.unitWidth, this.backId.homes[3]
        ));
        this.backArray.push(new MapElement(
            this.frontWidth - 4 * this.unitWidth, this.frontHeight - 13 * this.unitWidth,
            2 * this.unitWidth,   2 * this.unitWidth, this.backId.homes[4]
        ));
        this.backArray.push(new MapElement(
            this.frontWidth - 4 * this.unitWidth, this.frontHeight - 10 * this.unitWidth,
            2 * this.unitWidth,   2 * this.unitWidth, this.backId.homes[5]
        ));
        this.backArray.push(new MapElement(
            this.frontWidth - 10 * this.unitWidth, this.frontHeight - 4 * this.unitWidth,
            2 * this.unitWidth,   2 * this.unitWidth, this.backId.homes[6]
        ));
        this.backArray.push(new MapElement(
            this.frontWidth - 13 * this.unitWidth, this.frontHeight - 4 * this.unitWidth,
            2 * this.unitWidth,   2 * this.unitWidth, this.backId.homes[7]
        ));
        /**
         * hp, cp, regen--------------------------------------------------------
         */
        this.backArray.push(new MapElement(
            7 * this.unitWidth, 2 * this.unitWidth,
            3 * this.unitWidth,   3 * this.unitWidth, this.backId.hpRegenRed
        ));
        this.backArray.push(new MapElement(
            4 * this.unitWidth, 5 * this.unitWidth,
            3 * this.unitWidth,   3 * this.unitWidth, this.backId.cpRegen
        ));
        this.backArray.push(new MapElement(
            this.frontWidth - 7 * this.unitWidth, 5 * this.unitWidth,
            3 * this.unitWidth,   3 * this.unitWidth, this.backId.cpRegen
        ))
        this.backArray.push(new MapElement(
            this.frontWidth - 10 * this.unitWidth, 2 * this.unitWidth,
            3 * this.unitWidth,   3 * this.unitWidth, this.backId.hpRegenBlue
        ));
        /**
         * red base--------------------------------------------------------
         */
        this.backArray.push(new MapElement(
            4 * this.unitWidth, 11 * this.unitWidth,
            6 * this.unitWidth,   5 * this.unitWidth, this.backId.redBase
        ));
        this.backArray.push(new MapElement(
            4 * this.unitWidth, 10 * this.unitWidth,
            7 * this.unitWidth, this.unitWidth, this.backId.closeRoad
        ));
        this.backArray.push(new MapElement(
            10 * this.unitWidth, 11 * this.unitWidth,
            this.unitWidth, 5 * this.unitWidth, this.backId.closeRoad
        ));
        this.backArray.push(new MapElement(
            4 * this.unitWidth, 16 * this.unitWidth,
            7 * this.unitWidth, this.unitWidth, this.backId.closeRoad
        ));
        /**
         * blue base--------------------------------------------------------
         */
        this.backArray.push(new MapElement(
            this.frontWidth - 10 * this.unitWidth, 10 * this.unitWidth,
            6 * this.unitWidth,   5 * this.unitWidth, this.backId.blueBase
        ));
        this.backArray.push(new MapElement(
            this.frontWidth - 11 * this.unitWidth, 9 * this.unitWidth,
            7 * this.unitWidth,    this.unitWidth, this.backId.closeRoad
        ));
        this.backArray.push(new MapElement(
            this.frontWidth - 11 * this.unitWidth, 10 * this.unitWidth,
            this.unitWidth, 5 * this.unitWidth, this.backId.closeRoad
        ));
        this.backArray.push(new MapElement(
            this.frontWidth - 11 * this.unitWidth, 15 * this.unitWidth,
            7 * this.unitWidth, this.unitWidth, this.backId.closeRoad
        ));
     }
}

