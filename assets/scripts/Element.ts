import { _decorator, Component, Collider2D, Contact2DType, IPhysics2DContact, tween, CircleCollider2D } from 'cc';
import { MainGame } from './MainGame';
const { ccclass, property } = _decorator;

@ccclass('Element')
export class Element extends Component {
    @property
    elemNumber: number = 0;

    onLoad() {
        let collider = this.getComponent(CircleCollider2D);
        collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    start() {

    }

    update(deltaTime: number) {

    }

    onBeginContact(
        selfCollider: CircleCollider2D,
        otherCollider: CircleCollider2D,
        contact: IPhysics2DContact | null
    ) {
        if(otherCollider.group == selfCollider.group) {
            if(selfCollider.node.getPosition().y < otherCollider.node.getPosition().y ||
                    selfCollider.node.getPosition().y == otherCollider.node.getPosition().y &&
                    selfCollider.node.getPosition().x < otherCollider.node.getPosition().x) {
                return;
            }
            let selfNumber = selfCollider.node.getComponent(Element).elemNumber;
            let otherNumber = otherCollider.node.getComponent(Element).elemNumber;
            if(selfNumber != otherNumber || selfNumber + 1 == MainGame.instance.elemSprites.length) {
                return;
            }
            
            
            let newPos = otherCollider.node.getPosition();
            otherCollider.node.getComponent(CircleCollider2D).radius = 0;
            // otherCollider.node.getComponent(CircleCollider2D).apply();
            selfCollider.node.getComponent(CircleCollider2D).radius = 0;
            // selfCollider.node.getComponent(CircleCollider2D).apply();
            
            let tweenDuration = 0.1;
            tween(selfCollider.node).to(tweenDuration,
                {
                    position: newPos,
                }
            ).call(function () {
                MainGame.instance.createLevelUpElem(selfNumber + 1, newPos);
                selfCollider.node.active = false;
                otherCollider.node.active = false;
                selfCollider.node.destroy();
                otherCollider.node.destroy();
            }).start();
        }
    }
}

