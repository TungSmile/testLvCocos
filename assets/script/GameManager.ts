import { _decorator, Camera, Component, instantiate, Node, Prefab, quat, Quat, SkeletalAnimation, Sprite, tween, Vec3 } from 'cc';
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

    // for store
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
        // t.askSoliderForWeapon();
        t.checkQueueStore()
        t.schedule(() => { t.checkQueueStore() }, 5)
        // t.scheduleOnce(() => { t.testcam() }, 2)
        // t.checkQueueStore()
        t.changeStatus()

    }

    testcam() {
        let t = this;
        let rotation = Quat.fromEuler(new Quat, -30, 0, 0)
        tween(t.test)
            .to(3, { worldRotation: rotation })
            .start()
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
                return;
            }
        }
    }

    getSoliderByStatus(st: statusSolider) {
        let t = this;
        let rs = null;

        for (let i = 0; i < t.poolSolider.length; i++) {
            const solider = t.poolSolider[i];
            if (solider.getComponent(Solider).status == st) {
                rs = solider;
                return rs
            }
        }
        // t.poolSolider.forEach(solider => {
        //     // console.log(solider.getComponent(Solider).status == st);
        //     if (solider.getComponent(Solider).status == st) {
        //         rs = solider;
        //         return rs
        //     }
        // });
        return rs
    }

    reDirectStaff() {
        let t = this;

    }



    // for staff
    staffWalk(toPos: Vec3, directTo: Quat) {
        let t = this;
        let time = 1;
        // problem rotation of staff
        tween(t.staff)
            .to(time / 2, { worldRotation: directTo }).call(() => {
                t.staff.getComponent(SkeletalAnimation).play("Move 1")
            })
            .to(time, { worldPosition: toPos })
            .call(() => {
                t.staff.getComponent(SkeletalAnimation).play("Idle");
            })
            .delay(time / 4)
            .call(() => {
                t.changeStatus()
            })
            .start();
    }

    askSoliderForWeapon() {
        let t = this;
        // random weapon solider need
        // test 
        // t.slotSovle = t.queue.getChildByName("0")

        let tempWeapon: number = 0;
        let timeCD = 1;
        let statusSlot = t.slotSovle.getChildByName("logStatus")
        let loadingBar = t.slotSovle.getChildByPath("logStatus/loading");
        let imageWeapon = t.slotSovle.getChildByPath("logStatus/Item");
        // statusSlot.active = true;
        loadingBar.active = true;
        t.animationLoaing(timeCD, loadingBar);
        t.showWeaponWant(timeCD, imageWeapon);

    }


    animationLoaing(timeLoad: number, n: Node) {
        let t = this;
        let countRep = 0;
        let repeat = 20;  // for smooth render bar radian
        let barLoading = n.getChildByName("RadianBar").getComponent(Sprite);
        barLoading.fillRange = 0;
        t.schedule(() => {
            countRep++;
            barLoading.fillRange = (countRep / repeat)
            if ((countRep / repeat) == 1) {
                n.active = false
            }
        }, timeLoad / repeat, repeat);
    }

    showWeaponWant(timeLoad: number, n: Node) {
        let t = this;
        t.scheduleOnce(() => {
            n.active = true;
            t.changeStatus();
        }, timeLoad)
    }

    loadingCreateWeapon() {
        let t = this;
        let time = 1;
        let loading = t.posCreateWeapon.getChildByName("loading");
        loading.active = true;
        t.animationLoaing(time, loading);
        t.scheduleOnce(() => {
            loading.active = false;
            t.changeStatus();
        }, time)
    }



    //test
    statusStaff: statusStaff = statusStaff.init;

    slotSovle: Node = null;
    soliderSovle: Node = null;
    changeStatus() {
        let t = this;
        switch (t.statusStaff) {
            case statusStaff.init:
                // wait unlock after click hint
                t.staff.getComponent(SkeletalAnimation).play("Idle");
                t.statusStaff++;
                t.scheduleOnce(() => {
                    t.changeStatus();
                }, 1);
                break;
            case statusStaff.walkToQueue:
                t.soliderSovle = t.getSoliderByStatus(statusSolider.waitStaffCheck);
                console.log(t.soliderSovle);
                if (t.soliderSovle == null) {
                    t.scheduleOnce(() => {
                        t.changeStatus();
                    }, 2);
                    return
                }
                t.slotSovle = t.queue.getChildByName(t.soliderSovle.getComponent(Solider).slotStore)
                let posStand = t.slotSovle.getWorldPosition(new Vec3);
                // let dirStand = t.slotSovle.getWorldRotation(new Quat);
                let dirStand = Quat.invert(new Quat, t.slotSovle.getWorldRotation(new Quat))
                t.staffWalk(posStand, dirStand)
                t.statusStaff++;
                break;
            case statusStaff.checkSolider:
                // call slot queue store show item
                t.staff.getComponent(SkeletalAnimation).play("Idle");
                t.askSoliderForWeapon();
                t.statusStaff++;
                break;
            case statusStaff.walkToStore:
                let pos1 = t.posCreateWeapon.getWorldPosition(new Vec3);
                let dir1 = t.posCreateWeapon.getWorldRotation(new Quat);
                let temp = Quat.fromEuler(new Quat, 0, 180, 0)
                t.staffWalk(pos1,
                    // dir1
                    Quat.multiply(temp, temp, dir1)
                )
                t.statusStaff++;
                break;
            case statusStaff.createWeapon:
                // cooldown create weapon then go
                t.staff.getComponent(SkeletalAnimation).play("Idle");
                t.loadingCreateWeapon()
                t.statusStaff++;
                break;
            case statusStaff.giveWeaponForSolider:
                let pos2 = t.slotSovle.getWorldPosition(new Vec3);
                let dir2 = t.slotSovle.getWorldRotation(new Quat);
                t.staffWalk(pos2, dir2);
                t.statusStaff = statusStaff.init;

                // problem auto add solider in area fight
                let slotFight = t.areaFight.getChildByName("0");
                t.soliderSovle.getComponent(Solider).positionMove = slotFight.getWorldPosition(new Vec3);
                t.soliderSovle.getComponent(Solider).director = slotFight.getWorldRotation(new Quat);
                t.soliderSovle.getComponent(Solider).dirHp = Quat.invert(new Quat, slotFight.getWorldRotation(new Quat))

                t.scheduleOnce(() => {
                    t.statusQueue[Number(t.soliderSovle.getComponent(Solider).slotStore)] = false;
                    t.slotSovle.getChildByPath("logStatus/Item").active = false;
                    t.soliderSovle.getComponent(Solider).animationForStatus(statusSolider.waitStaffGetWeapon);
                }, 1)
                break;
            default:
                console.log("How can do that ???");
                break;
        }

    }


    onOffBarHp() {
        let t = this;

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