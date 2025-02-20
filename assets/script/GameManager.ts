import { _decorator, Camera, Component, instantiate, Node, Prefab, Quat, SkeletalAnimation, tween, Vec3 } from 'cc';
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

    @property({ type: Node })
    private staff: Node = null
    @property({ type: Node })
    private posCreateWeapon: Node = null


    @property({ type: Camera })
    private cam2D: Camera = null
    @property({ type: Node })
    private test: Node = null

    start() {
        let t = this;
        // set camera and boss show 
        t.setData();
        t.askSoliderForWeapon();
        // t.schedule(() => { t.checkQueueStore() }, 5)
    }



    // 6 slot a round boss
    // 4 slot queue in store
    // 1 slot for init customer
    // status solider : active -> go to store -> wait order -> show item if staff check -> get item by staff -> fight boss
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



    initCustomer(n: string) {
        // useless
        let t = this;
        let solider = instantiate(t.solider);
        t.poolSolider.push(solider);
        t.node.addChild(solider);
        solider.setRotation(t.startPosition.getWorldRotation(new Quat))
        solider.setWorldPosition(t.startPosition.getWorldPosition(new Vec3))
        solider.getComponent(Solider).status = 0;
        solider.getComponent(Solider).positionStand = t.startPosition.getWorldPosition(new Vec3);
        solider.getComponent(Solider).positionMove = t.queue.getChildByName(n).getWorldPosition(new Vec3);
        solider.getComponent(Solider).director = t.queue.getChildByName(n).getWorldRotation(new Quat);
        solider.getComponent(Solider).slotStore = n;
        let time = 1;
        t.scheduleOnce(() => {
            solider.getComponent(Solider).animationForStatus();
        }, time)

    }

    checkQueueStore() {
        let t = this;
        for (let i = 0; i < t.statusQueue.length; i++) {
            const e = t.statusQueue[i];
            if (e == false) {
                t.statusQueue[i] = true
                t.initCustomer(i.toString());
                break;
            }
        }
    }

    getSoliderByStatus(st: statusSolider) {
        let t = this;
        t.poolSolider.forEach(solider => {
            if (solider.getComponent(Solider).status == st) {
                return solider;
            }
        });
        return null;
    }

    // for staff
    staffWalk(toPos: Vec3, directTo: Quat) {
        let t = this;
        let time = 1;
        t.staff.getComponent(SkeletalAnimation).play("Move")
        tween(t.staff)
            .to(time, { worldPosition: toPos, worldRotation: directTo })
            .call(() => {
                t.changeStatus()
            })
            .start();
    }

    askSoliderForWeapon() {
        let t = this;
        // t.slotSovle.getChildByName("load").active = true;

        // test
        t.slotSovle = t.queue.getChildByName("0");




        const worldPosition = t.slotSovle.getWorldPosition(new Vec3);
        const cameraPoint = new Vec3();
        t.cam2D.worldToScreen(worldPosition, cameraPoint);
        const screenPoint = new Vec3();
        t.cam2D.screenToWorld(cameraPoint, screenPoint);
        t.test.setPosition(screenPoint);
    }





    statusStaff: statusStaff = statusStaff.init;
    slotSovle: Node = null;
    soliderSovle: Node = null;
    changeStatus() {
        let t = this;
        switch (t.statusStaff) {
            case statusStaff.init:
                // wait unlock after click hint
                break;
            case statusStaff.walkToQueue:
                t.soliderSovle = t.getSoliderByStatus(statusSolider.waitStaffCheck);
                t.slotSovle = t.queue.getChildByName(t.soliderSovle.getComponent(Solider).slotStore)
                let posStand = t.slotSovle.getWorldPosition(new Vec3);
                let dirStand = t.slotSovle.getWorldRotation(new Quat);
                t.staffWalk(posStand, dirStand)
                t.statusStaff++;
                break;
            case statusStaff.checkSolider:
                // call slot queue store show item
                t.staff.getComponent(SkeletalAnimation).play("Idle")
                t.statusStaff++;
                break;
            case statusStaff.walkToStore:
                let pos1 = t.posCreateWeapon.getWorldPosition(new Vec3);
                let dir1 = t.posCreateWeapon.getWorldRotation(new Quat);
                t.staffWalk(pos1, dir1)
                t.statusStaff++;
                break;
            case statusStaff.createWeapon:
                // cooldown create weapon then go
                t.staff.getComponent(SkeletalAnimation).play("Idle")
                t.statusStaff++;
                break;
            case statusStaff.giveWeaponForSolider:
                let pos2 = t.slotSovle.getWorldPosition(new Vec3);
                let dir2 = t.slotSovle.getWorldRotation(new Quat);
                t.staffWalk(pos2, dir2)
                t.statusStaff = statusStaff.walkToQueue;
                break;
            default:
                console.log("How can do that ???");

                break;
        }

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
    walkToBoss = 6,
    fightBoss = 7
}
export enum statusStaff {
    init = 0,
    walkToQueue = 1,
    checkSolider = 2,
    walkToStore = 3,
    createWeapon = 4,
    giveWeaponForSolider = 5


}