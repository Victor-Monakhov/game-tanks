export default class Sound{
    sounds = new Map();
    counter = 0;
    constructor(redBase, blueBase, player, units, towers, mobs) {
        units.forEach(unit=>{
            if(unit.id === player.id){
                this.sounds.set(unit.id, new Audio("../../sounds/ShotLoud.mp3"));
            }
            else this.sounds.set(unit.id, new Audio("../../sounds/ShotQuit.mp3"));
        });
        towers.forEach(tower=>{
            this.sounds.set(tower.id, new Audio("../../sounds/ShotQuit.mp3"));
        });
        mobs.forEach(mob=>{
            this.sounds.set(mob.id, new Audio("../../sounds/ShotQuit.mp3"));
        });
        this.sounds.set(redBase.tower1.id, new Audio("../../sounds/ShotQuit.mp3"));
        this.sounds.set(redBase.tower2.id, new Audio("../../sounds/ShotQuit.mp3"));
        this.sounds.set(blueBase.tower1.id, new Audio("../../sounds/ShotQuit.mp3"));
        this.sounds.set(blueBase.tower2.id, new Audio("../../sounds/ShotQuit.mp3"));
        this.sounds.set('Wind', new Audio("../../sounds/Wind.mp3"));
    }
}
