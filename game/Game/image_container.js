export default class Pictures {
    images = new Map([
        ["testGameMap", new Image(4000, 2000)],
        ["bullet_1", new Image(60, 60)],
        ["bullet_1_shot", new Image(60, 60) ],
        ["bullet_1_boom", new Image(60, 60)],
        ["T_1", new Image(60, 60)],
        ["T_2", new Image(60, 60)],
        ["T_3", new Image(60, 60)],
        ["T_4", new Image(60, 60)],
        ["tower_1", new Image(60, 60)],
        ["tower_2", new Image(60, 60)],
        ["tower_3", new Image(60, 60)],
        ["gun_1", new Image(60, 60)],
        ["gun_2", new Image(60, 60)],
        ["gun_3", new Image(60, 60)],
        ["gun_4", new Image(60, 60)],
        ["gun_5", new Image(60, 60)],
        ["redCrash", new Image(60, 60)],
        ["blueCrash", new Image(60, 60)],
        ["smoke_1", new Image(60, 60)],
    ]);
    counter = 0;
    constructor() {
        this.images.get("testGameMap").src = "../../images/testGame/map_1.png";
        this.images.get("bullet_1").src = "../../images/testGame/bullet_1.png";
        this.images.get("bullet_1_shot").src = "../../images/testGame/bullet_1_shot.png";
        this.images.get("bullet_1_boom").src = "../../images/testGame/bullet_1_boom.png";
        this.images.get("T_1").src = "../../images/testGame/T_1.png";
        this.images.get("T_2").src = "../../images/testGame/T_2.png";
        this.images.get("T_3").src = "../../images/testGame/T_3.png";
        this.images.get("T_4").src = "../../images/testGame/T_4.png";
        this.images.get("tower_1").src = "../../images/testGame/tower_1.png";
        this.images.get("tower_2").src = "../../images/testGame/tower_2.png";
        this.images.get("tower_3").src = "../../images/testGame/tower_3.png";
        this.images.get("gun_1").src = "../../images/testGame/gun_1.png";
        this.images.get("gun_2").src = "../../images/testGame/gun_2.png";
        this.images.get("gun_3").src = "../../images/testGame/gun_3.png";
        this.images.get("gun_4").src = "../../images/testGame/gun_4.png";
        this.images.get("gun_5").src = "../../images/testGame/gun_5.png";
        this.images.get("redCrash").src = "../../images/testGame/redCrash.png";
        this.images.get("blueCrash").src = "../../images/testGame/blueCrash.png";
        this.images.get("smoke_1").src = "../../images/testGame/smoke_1.png";
    }

    allUploaded(callback){
        let ready = () =>{
            if(++this.counter === this.images.size) {
                callback();
            }
        }
        this.images.forEach(image =>{
            image.onload = ready;
        });
    }
}
