import { _decorator, Component, Node, tween, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AdjustWithHeight')
export class AdjustWithHeight extends Component {
    @property
    offset:number = 0;

    @property
    hasShowEffect:boolean = false;

    onLoad() {
        let y = screen.height / 2;
        if(this.hasShowEffect) {
            y += this.offset;
        }
        this.node.setPosition(this.node.position.x, y);
    }

    start() {
        this.showTheNode();
    }

    update(deltaTime: number) {

    }

    showTheNode() {
        if(this.hasShowEffect) {
            let tweenDuration:number = 1.0;
            tween(this.node.position).to(tweenDuration,
                new Vec3(this.node.position.x, this.node.position.y + this.offset),
                {
                    onUpdate : (target: Vec3, ratio : number)=>{
                        this.node.position = target;
                    }
                }
            ).start();
        }
    }
}

