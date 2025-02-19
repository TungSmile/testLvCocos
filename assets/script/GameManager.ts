import { _decorator, Component, instantiate, Node, Prefab, Vec3 } from 'cc';
import { DataManager } from './DataManager';
import { Solider } from './Solider';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property({ type: Node })
    private queue: Node = null
    @property({ type: Node })
    private startPosition: Node = null
    @property({ type: Node })
    private areaFight: Node = null
    private CustomerOder = 0;
    private CustomerFight = 0;
    private statusQueue: boolean[] = [];
    private statusFights: boolean[] = [];
    @property(Prefab)
    solider: Prefab = null!;
    private poolSolider: Node[] = [];

    start() {
        let t = this;
        t.setData()
    }



    // 6 slot a round boss
    // 4 slot queue in store
    // 1 slot for init customer
    // status cusomer : active -> go to store -> wait order -> show item if staff check -> get item by staff -> fight boss
    // status staff :active -> check wait cus (show item need )-> get item for cus -> loop
    // status boss:active ->change direct to new cus ->hit who -> if who die  loop


    setData() {
        // to fill data for begin
        let t = this;
        for (let i = 0; i < DataManager.instance.slotStore; i++) {
            t.statusQueue.push(false);
        }
        for (let i = 0; i < DataManager.instance.slotFight; i++) {
            t.statusFights.push(false);
        }
    }



    initCustomer() {
        let t = this;
        let solider = instantiate(t.solider);
        solider.getComponent(Solider).status = 0;
        solider.getComponent(Solider).position = t.startPosition.getWorldPosition(new Vec3);
        solider.getComponent(Solider).animationForStatus()
    }






    update(deltaTime: number) {

    }
}

export enum statusSolider {
    show = 0,
    walkToStore = 1,
    waitStaffCheck = 2,
    showWeapon = 3,
    waitStaffGetWeapon = 4,
    getWeapon = 5,
    fightBoss = 6
}