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
    CircleCollider2D,
    UITransform,
    ERigidBody2DType, 
    PhysicsSystem2D} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MainGame')
export class MainGame extends Component {
    @property([SpriteFrame])
    elemSprites:Array<SpriteFrame> = [];

    @property(Prefab)
    elemPre: Prefab = null;

    @property(Node)
    topNode: Node = null;

    @property(Camera)
    camera: Camera = null;

    targetElem: Node = null;

    createElemCount: number = 0;

    onLoad() {
        PhysicsSystem2D.instance.enable = true;
    }

    start() {
        this.createOneElem(0);

        this.bindTouch()
    }

    update(deltaTime: number) {

    }

    createOneElem(index: number) {
        var newElem = instantiate(this.elemPre);
        newElem.parent = this.topNode;
        newElem.getComponent(Sprite).spriteFrame = this.elemSprites[index];
        newElem.getComponent('Element')!.elemNumber = index;

        newElem.getComponent(RigidBody2D).type = ERigidBody2DType.Static
        newElem.getComponent(CircleCollider2D).radius = 0;
        newElem.getComponent(CircleCollider2D).apply();

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
        let t = this, scheduleOnceDelay = 5;
        
        let height = this.targetElem.getComponent(UITransform).height;
        this.targetElem.getComponent(CircleCollider2D).radius = height / 2;
        this.targetElem.getComponent(CircleCollider2D).apply();
        this.targetElem.getComponent(RigidBody2D).type = ERigidBody2DType.Dynamic;
        this.targetElem.getComponent(RigidBody2D).linearVelocity = new Vec2(0, 0);

        this.scheduleOnce(function () {
            switch (t.createElemCount) {
                case 0:
                    t.createOneElem(0), t.createElemCount++;
                    break;
                    
                default:
                    t.createOneElem(0), t.createElemCount++;
                    break;
            }
        }, scheduleOnceDelay);
    }
}

