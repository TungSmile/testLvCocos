import { _decorator, Camera, Component, geometry, Label, Node, PhysicsSystem } from 'cc';
import { DataManager } from './DataManager';
const { ccclass, property } = _decorator;

@ccclass('Menu2D')
export class Menu2D extends Component {
    @property({ type: Node })
    showCoin: Node = null;
    @property({ type: Node })
    listernerTouch: Node = null;

    start() {

    }

    registerEvent() {
        let t = this;
        t.listernerTouch.on(Node.EventType.TOUCH_START, t.onTouchStart, t);
        t.listernerTouch.on(Node.EventType.TOUCH_END, t.onTouchEnd, t);
        t.listernerTouch.on(Node.EventType.TOUCH_CANCEL, t.onTouchEnd, t);
        t.listernerTouch.on(Node.EventType.TOUCH_MOVE, t.onTouchEnd, t);
    }


    onTouchStart(event) {
        let t = this;
        const touches = event.getAllTouches();
        // t.startEventRotation = event.getLocation();
        const camera = t.node.getChildByName("Camera").getComponent(Camera);
        // event raycast check obj
        let ray = new geometry.Ray();
        camera.screenPointToRay(event.getLocationX(), event.getLocationY(), ray);
        const mask = 0xffffffff;
        const maxDistance = 10000000;
        const queryTrigger = true;
        const bResult = PhysicsSystem.instance.raycastClosest(ray, mask, maxDistance, queryTrigger);
        if (bResult) {
            const results = PhysicsSystem.instance.raycastResults;
            const raycastClosestResult = PhysicsSystem.instance.raycastClosestResult;
            const collider = raycastClosestResult.collider;

            // sovle open gift

            if (collider.node) {
                // if (t.checkCollider(collider.node)) {
                //     return;
                // }

            }
        }
    }


    onTouchEnd(event) {
        let t = this;
        // nothing
    }

    changeNumberCoin(num: number) {
        let t = this;
        // let numdifference = num;
        let time = 2 / num;
        for (let i = 0; i < num; i++) {
            t.scheduleOnce(() => {
                let temp = DataManager.instance.numberMoney + i
                t.showCoin.getComponent(Label).string = temp.toString();
            }, time * i)
            if (i + 1 == num) {
                DataManager.instance.numberMoney += num
            }
        }
    }



    update(deltaTime: number) {

    }
}

