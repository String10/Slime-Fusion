import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Element')
export class Element extends Component {
    @property
    elemNumber: number = 0;

    start() {

    }

    update(deltaTime: number) {
        
    }
}

