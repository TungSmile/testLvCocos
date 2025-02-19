import { _decorator, Component, Node, SkeletalAnimation, sp, Vec3 } from 'cc';
import { statusSolider } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('Solider')
export class Solider extends Component {

    status: statusSolider = statusSolider.show
    position: Vec3 = null;

    start() {

    }

    animationForStatus() {
        let t = this;
        switch (t.status) {
            case 0:
                // init
                t.node.setWorldPosition(t.position);
                t.node.getComponent(SkeletalAnimation)
                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
            case 4:
                break;
            default:
                break;
        }

    }



    update(deltaTime: number) {

    }
}

