import { 
    _decorator,
    Component,
    Node,
    SpriteFrame,
    Prefab,
    instantiate,
    Sprite,
    tween,
    Vec2,
    Vec3,
    EventTouch,
    Input,
    Camera,
    view,
    RigidBody2D,
    Collider2D,
    UITransform,
    ERigidBody2DType, 
    PhysicsSystem2D,
    Animation
} from 'cc';
import { Element } from './Element';
const { ccclass, property } = _decorator;

@ccclass('MainGame')
export class MainGame extends Component {
    @property([SpriteFrame])
    elemSprites:Array<SpriteFrame> = [];

    @property(Prefab)
    elemPre: Prefab = null;

    @property(Node)
    topNode: Node = null;

    @property(Node)
    elemNode: Node = null;

    @property(Node)
    nekoNode: Node = null;

    @property(Camera)
    camera: Camera = null;

    targetElem: Node = null;

    createElemCount: number = 0;

    static instance: MainGame = null;

    onLoad() {
        if (null != MainGame.instance) {
            MainGame.instance.destroy();
        }
        MainGame.instance = this;

        PhysicsSystem2D.instance.enable = true;
    }

    start() {
        //this.createOneElem(0);
        this.scheduleOnce(function () {
            this.createOneElem(Math.floor(MainGame.range(0, 3)) % this.elemSprites.length), this.createElemCount++;
        }, 1.0);

        this.bindTouch()
    }

    update(deltaTime: number) {

    }
    //创建一个史莱姆
    createOneElem(index: number) {
        var newElem = instantiate(this.elemPre);
        newElem.parent = this.topNode;
        newElem.getComponent(Sprite).spriteFrame = this.elemSprites[index];
        newElem.getComponent(Element).elemNumber = index;

        newElem.getComponent(RigidBody2D).type = ERigidBody2DType.Static
        //newElem.getComponent(Collider2D).radius = 0;
        newElem.getComponent(Collider2D).apply();

        newElem.scale = new Vec3(0, 0, 0);
        let tweenDuration:number = 0.2, t = this;
        tween(newElem).to(tweenDuration,
            {
                scale: new Vec3(1, 1, 1),
            },
            {
                easing: 'backOut',
            }
        ).call(function () {
            t.targetElem = newElem;
        }).start();
    }
    
    createLevelUpElem(index: number, positon: Vec3) {
        let t = this, elem = instantiate(this.elemPre);
        elem.parent = t.elemNode;
        elem.getComponent(Sprite).spriteFrame = t.elemSprites[index];
        elem.getComponent(Element).elemNumber = index;
        elem.setPosition(positon);
        elem.scale = new Vec3(0, 0, 0);

        elem.getComponent(RigidBody2D).linearVelocity = new Vec2(0, 0);
        //elem.getComponent(Collider2D).radius = elem.getComponent(UITransform).height / 2;
        elem.getComponent(Collider2D).apply();

        let tweenDuration = 0.5;
        tween(elem).to(tweenDuration,
            {
                scale: new Vec3(1, 1, 1),
            },
            {
                easing: 'backOut',
            }
        ).start();
    }
    //绑定touch事件
    bindTouch() {
        this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }
    
    onTouchStart(e: EventTouch) {
        if(null == this.targetElem) {
            return;
        }
        let x = e.touch.getUILocation().x - view.getVisibleSize().x / 2, y = this.targetElem.position.y;
        let tweenDuration:number = 0.2;
        tween(this.targetElem).to(tweenDuration,
            {
                position: new Vec3(x, y, 0),
            }
        ).start();
    }

    onTouchMove(e: EventTouch) {
        if(null == this.targetElem) {
            return;
        }

        this.targetElem.setPosition(
            e.touch.getUILocation().x - view.getVisibleSize().x / 2,
            this.targetElem.position.y,
            0
        );
    }

    onTouchEnd(e: EventTouch) {
        if(null == this.targetElem) {
            return;
        }
        let t = this, scheduleOnceDelay = 1.0;
        
        let height = this.targetElem.getComponent(UITransform).height;
        //this.targetElem.getComponent(Collider2D).radius = height / 2;
        this.targetElem.getComponent(Collider2D).apply();
        this.targetElem.getComponent(RigidBody2D).type = ERigidBody2DType.Dynamic;
        this.targetElem.getComponent(RigidBody2D).linearVelocity = new Vec2(0, 0);

        this.targetElem.setParent(this.elemNode);

        this.scheduleOnce(function () {
            t.createOneElem(Math.floor(MainGame.range(0, 3)) % t.elemSprites.length), t.createElemCount++;
        }, scheduleOnceDelay);

        this.targetElem = null;
    }

    static seed: number = 0;
    static range(min: number, max: number): number {
        if (!this.seed && this.seed != 0) {
            this.seed = new Date().getTime();
        }
        max = max || 1;
        min = min || 0;
        this.seed = (this.seed * 9301 + 49297) % 233280;
        var rnd = this.seed / 233280.0;
        return min + rnd * (max - min);
    }
}

