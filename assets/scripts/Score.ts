import { _decorator, Component, Node, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Score')
export class Score extends Component {
    static instance: Score = null;

    @property(Label)
    label: Label = null;

    scoreNumber: number = 0;
    scoreTarget: number = 0;
    scoreIsChanged: boolean = false;

    onLoad() {
        if(Score.instance != null) {
            Score.instance.destroy();
        }
        Score.instance = this;

        this.scoreNumber = 0;
        this.scoreTarget = 0;
        this.scoreIsChanged = false;
    }

    start() {
        
    }

    update(deltaTime: number) {
        if(this.scoreIsChanged) {
            this.scoreNumber = this.scoreTarget;
            this.scoreIsChanged = false;

            this.label.string = (Array(4).join('0') + this.scoreNumber).slice(-4);
        }
    }

    addScore(delta: number) {
        this.scoreTarget += delta;
        this.scoreIsChanged = true;
    }
}

