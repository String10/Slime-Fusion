import { _decorator, Component, director, Button} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('menu')
export class menu extends Component {

    @property(Button)
    changescene: Button = null;

    onLoad() {
        this.changescene.node.on(Button.EventType.CLICK, this.change, this);

        director.preloadScene("maingame");
    }

    start() {

    }

    change() {
        director.loadScene("maingame");
    }

    update(deltaTime: number) {

    }
}

