import { _decorator, Component, Contact2DType, IPhysics2DContact, tween, Collider2D } from 'cc';
import { Bucket } from './Bucket';
const { ccclass, property } = _decorator;

@ccclass('Element')
export class Element extends Component {
    @property
    elemNumber: number = 0;

    onLoad() {
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
        if(otherCollider.group == selfCollider.group) {
            if(selfCollider.node.getPosition().y < otherCollider.node.getPosition().y ||
                    selfCollider.node.getPosition().y == otherCollider.node.getPosition().y &&
                    selfCollider.node.getPosition().x < otherCollider.node.getPosition().x) {
                return;
            }
            let selfNumber = selfCollider.node.getComponent(Element).elemNumber;
            let otherNumber = otherCollider.node.getComponent(Element).elemNumber;
            if(selfNumber != otherNumber || selfNumber + 1 == Bucket.instance.elemSprites.length) {
                return;
            }


            let newPos = otherCollider.node.getPosition();
            //otherCollider.node.getComponent(Collider2D).radius = 0;
            // otherCollider.node.getComponent(Collider2D).apply();
            //selfCollider.node.getComponent(Collider2D).radius = 0;
            // selfCollider.node.getComponent(Collider2D).apply();

            let tweenDuration = 0.1;
            tween(selfCollider.node).to(tweenDuration,
                {
                    position: newPos,
                }
            ).call(function () {
                Bucket.instance.createLevelUpElem(selfNumber + 1, newPos);
                selfCollider.node.active = false;
                otherCollider.node.active = false;
                selfCollider.node.destroy();
                otherCollider.node.destroy();
            }).start();
        }
    }
}

