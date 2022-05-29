import { _decorator, Component, Node , director, Button ,EventHandler } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('menu')
export class menu extends Component {

    @property(Button)
    changescene: Button = null;

    onLoad() {
        this.changescene.node.on(Button.EventType.CLICK, this.change, this);
    }

    start() {

    }

    change() {
        director.loadScene("maingame");
        console.log("114514");
    }

    update(deltaTime: number) {
        
    }
}

