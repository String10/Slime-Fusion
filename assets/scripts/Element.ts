import { _decorator, Component, Contact2DType, IPhysics2DContact, tween, Collider2D, Enum, Vec2, Vec3 } from 'cc';
import { AudioSet } from './AudioSet';
import { Bucket } from './Bucket';
import { Score } from './Score';
const { ccclass, property } = _decorator;

@ccclass('Element')
export class Element extends Component {
    @property
    elemNumber: number = 0;

    elemLevel: number = 0;

    static table: Vec3[] = null;

    onLoad() {
        if(Element.table == null) {
            let FIRE = 0,
                WATER = 1,
                GRASS = 2,
                GROUND = 3,
                THUNDER = 4,
                ICE = 5,
                WIND = 6,
                METAL = 7,
                CLOUD = 8,
                HANDSSOME = 9,
                LEMON = 10,
                BEAR = 11,
                ICECREAM = 12,
                SUSHI = 13,
                RAINBOW = 14
            ;
            var table = [];
            //table.push(new Vec3(WATER,  GROUND, RAINBOW));

            table.push(new Vec3(WATER,  GROUND, GRASS));
            table.push(new Vec3(WATER,  WIND,   ICE));
            table.push(new Vec3(FIRE,   WIND,   THUNDER));
            table.push(new Vec3(GRASS,   WATER,   LEMON));
            table.push(new Vec3(METAL,   BEAR,   HANDSSOME));
            table.push(new Vec3(GRASS,   GROUND,   BEAR));
            table.push(new Vec3(ICE,   LEMON,   ICECREAM));
            table.push(new Vec3(HANDSSOME,   CLOUD,   SUSHI));
            table.push(new Vec3(WATER,   FIRE,   CLOUD));
            table.push(new Vec3(WATER,   WIND,   ICE));
            table.push(new Vec3(GROUND,   FIRE,   METAL));
            table.push(new Vec3(ICECREAM,   SUSHI,   RAINBOW));

            table.push(new Vec3(HANDSSOME,   SUSHI,   HANDSSOME));
            table.push(new Vec3(HANDSSOME,   ICECREAM,   HANDSSOME));
            table.push(new Vec3(HANDSSOME,   LEMON,   HANDSSOME));

            table.push(new Vec3(BEAR,   GRASS,   BEAR));
            table.push(new Vec3(BEAR,   ICECREAM,   BEAR));
            table.push(new Vec3(BEAR,   LEMON,   BEAR));
            table.push(new Vec3(BEAR,   SUSHI,   BEAR));

            table.push(new Vec3(FIRE, GRASS, FIRE));
            table.push(new Vec3(METAL, THUNDER, METAL));

            Element.table = table;
        }

        let collider = this.getComponent(Collider2D);
        collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    start() {

    }

    update(deltaTime: number) {

    }

    onBeginContact(
        selfCollider: Collider2D,
        otherCollider: Collider2D,
        contact: IPhysics2DContact | null
    ) {
        if(selfCollider.getComponent(Collider2D).group == 32
            && selfCollider.node.getPosition().y < -50){//防止穿墙一半卡死
            // console.log(selfCollider.node.getPosition().y);
            selfCollider.getComponent(Collider2D).group = 2;
        }
        if(otherCollider.group == selfCollider.group) {
            if(selfCollider.node.getPosition().y < otherCollider.node.getPosition().y ||
                    selfCollider.node.getPosition().y == otherCollider.node.getPosition().y &&
                    selfCollider.node.getPosition().x < otherCollider.node.getPosition().x) {
                return;
            }
            let xx = selfCollider.node.getPosition().x, yy = selfCollider.node.getPosition().y
            //Bucket.instance.attract(xx,yy,10000,3);
            let selfNumber = selfCollider.node.getComponent(Element).elemNumber;
            let otherNumber = otherCollider.node.getComponent(Element).elemNumber;
            var targetNumber = -1;

            for(var i = 0; i < Element.table.length; i++) {
                var rule = Element.table[i];
                if(rule.x == selfNumber && rule.y == otherNumber ||
                        rule.y == selfNumber && rule.x == otherNumber) {
                    targetNumber = rule.z;
                    break;
                }
            }

            if(targetNumber < 0) {
                return;
            }

            let targetLevel = Math.max(
                selfCollider.node.getComponent(Element).elemLevel,
                otherCollider.node.getComponent(Element).elemLevel
            ) + 1;

            // console.log(targetLevel);

            let newPos = otherCollider.node.getPosition();
            //otherCollider.node.getComponent(Collider2D).radius = 0;
            // otherCollider.node.getComponent(Collider2D).apply();
            //selfCollider.node.getComponent(Collider2D).radius = 0;
            // selfCollider.node.getComponent(Collider2D).apply();

            selfCollider.group = 8;
            otherCollider.group = 16;

            let tweenDuration = 0.1;
            tween(selfCollider.node).to(tweenDuration,
                {
                    position: newPos,
                }
            ).call(function () {
                Bucket.instance.createLevelUpElem(targetNumber, targetLevel, newPos);
                selfCollider.node.active = false;
                otherCollider.node.active = false;
                selfCollider.node.destroy();
                otherCollider.node.destroy();

                AudioSet.instance.playSound(Math.floor(Bucket.range(0, 2)) % 2, 1);
                if(targetNumber == 4)Bucket.instance.attract(xx,yy,2500,2.5);
                if(targetNumber == 7)Bucket.instance.attract(xx,yy,5000,1.5);
                if(targetNumber == 11)Bucket.instance.blast(xx,yy,5000,1.5);
                if(targetNumber == 10)Bucket.instance.blast(xx,yy,2500,2.5);
                if(targetNumber == 12 || targetNumber == 13)Bucket.instance.attract(xx,yy,10000,2.5);
                if(targetNumber == 8)Bucket.instance.fly(xx,yy,300,1.5);

                Score.instance.addScore(Math.min(2**targetLevel,256));
            }).start();
            /*if(targetNumber == 4){
                Bucket.instance.attract(xx,yy,10000,1.5);
                Bucket.instance.attract(xx,yy,10000,1.5);
                Bucket.instance.attract(xx,yy,10000,1.5);
            }*/
        }
    }
}

