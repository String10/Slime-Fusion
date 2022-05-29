import { _decorator, Component, Node, AudioClip, AudioSource, game, clamp01 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioSet')
export class AudioSet extends Component {
    @property(AudioSource)
    audioSrc: AudioSource = null;

    @property([AudioClip])
    audios: Array<AudioClip> = [];

    static instance: AudioSet = null;

    onLoad() {
        if(AudioSet.instance != null) {
            AudioSet.instance.destroy();
        }
        AudioSet.instance = this;

        this.audioSrc = this.node.getComponent(AudioSource);
        this.setMusicVolume(1);
    }

    start() {

    }

    update(deltaTime: number) {
        
    }

    playSound(index: number, volumeScale: number) {
        this.audioSrc.playOneShot(AudioSet.instance.audios[index], volumeScale);
    }

    setMusicVolume(volume: number) {
        this.audioSrc.volume = clamp01(volume);
    }
}

