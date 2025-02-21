import { _decorator, Color, Component, MeshRenderer, Node, Quat, SkeletalAnimation, sp, Sprite, tween, Vec3 } from 'cc';
import { statusSolider } from './GameManager';
import { DataManager } from './DataManager';
const { ccclass, property } = _decorator;

@ccclass('Solider')
export class Solider extends Component {

    public status: statusSolider = statusSolider.show
    public positionStand: Vec3 = null;
    public positionMove: Vec3 = null;
    public director: Quat = null;
    public hasAction: boolean = false;
    private hpCap: number = 0;
    private hpCuren: number = 0;
    @property({ type: SkeletalAnimation })
    private mainSkeAni: SkeletalAnimation = null;

    public slotStore: string;
    public slotFight: string;
    // for hp
    private BarHp: Node = null;
    public dirHp: Quat = null;


    start() {
        let t = this;
        t.setColorBarHP()
        t.hpCap = DataManager.instance.hpSolider1;
        t.hpCuren = DataManager.instance.hpSolider1;
        // t.mainSkeAni = t.node.getComponent(SkeletalAnimation);
        t.mainSkeAni.play("Idle");
        t.BarHp = t.node.getChildByName("bgBarHp");
    }


    setColorBarHP() {
        let t = this;
        let mlt = t.node.getChildByPath("barHpTemp/hp").getComponent(MeshRenderer).getMaterial(0);
        mlt.setProperty('mainColor', new Color(255, 0, 0)) // red
    }

    // change leght bar hp bi refen n 
    changeBarHp(n: number) {
        let t = this;
        let rate = (t.hpCuren - n) / t.hpCap;
        if ((t.hpCuren - n) <= 0) {
            t.eventDieChar();
            rate = 0;
        }
        let barHp = t.BarHp.getChildByName("barHp")
        t.node.getChildByPath("barHpTemp/hp");
        // barHp.setScale(1.1, rate, 1);
        // barHp.setPosition(new Vec3(0, 1 - rate, 0));
        barHp.getComponent(Sprite).fillRange = rate;
    }


    animationForStatus(s: statusSolider = statusSolider.show) {
        let t = this;
        if (s != statusSolider.show) {
            t.status = s;
        }
        switch (t.status) {
            case 0:
                // init and walk to store
                t.node.setWorldPosition(t.positionStand);
                t.status = statusSolider.walkToStore;
                t.waldToSomeWhere()
                break;
            case 1:
                // stand store for wait staff
                t.node.setWorldPosition(t.positionStand);
                t.status = statusSolider.waitStaffCheck;
                break;
            case 2:
                // show weapon , who want
                t.status = statusSolider.showWeapon;
                break;
            case 3:
                // wait staff get weapon
                t.status = statusSolider.waitStaffGetWeapon;
                break;
            case 4:
                // active weapon 
                t.node.getChildByName('1').active = true;
                t.node.getChildByName('2').active = true;
                t.node.getChildByName('3').active = true;
                t.status = statusSolider.getWeapon;
                t.animationForStatus()
                break;
            case 5:
                // solider walk to area Boss
                t.status = statusSolider.walkToBoss;
                // set position by gamemanager  
                t.reDirect();
                break;
            case 6:
                // fight boss still to die
                t.status = statusSolider.fightBoss;
                let timeReload = 3;
                t.fightBoss();
                t.schedule(() => {
                    t.fightBoss();
                }, timeReload)
                break;
            default:
                console.log("wtf!!! how ???");
                break;
        }

    }

    isReload: boolean = true;
    fightBoss() {
        let t = this;
        // t.mainSkeAni.on(SkeletalAnimation.EventType.FINISHED, t.onAnimationFinished, t);
        // t.playNextClip();
        t.mainSkeAni.play(t.isReload ? "Attack_3" : "Attack_3_Idle");
        t.isReload = !t.isReload
    }
    // onAnimationFinished() {
    //     this.playNextClip();
    // }
    // clips: string[] = ["Attack_3", "Attack_3_Idle"];
    // currentClipIndex: number = 1;
    // playNextClip() {
    //     let t = this;
    //     const clipName = t.clips[t.currentClipIndex];
    //     t.mainSkeAni.play(clipName);
    //     console.log(clipName);
    //     t.currentClipIndex++;
    //     if (t.currentClipIndex >= this.clips.length) {
    //         t.currentClipIndex = 0;
    //     }

    // }


    reDirect() {
        // redirect first before move
        let t = this;
        let time = 1;
        tween(t.node).to(time, { worldRotation: t.director })
            .call(() => {
                t.waldToSomeWhere()
            })
            .start()
    }


    waldToSomeWhere() {
        let t = this;
        if (t.hasAction) {
            return
        }
        let time = 2;
        t.hasAction = true;
        t.mainSkeAni.play("Move");
        tween(t.node)
            .to(time, { worldPosition: t.positionMove, worldRotation: t.director })
            .call(() => {
                t.positionStand = t.positionMove.clone();
                t.hasAction = false;
                t.mainSkeAni.play("Idle");
                t.animationForStatus()
            })
            .start()
    }

    onBarHp() {
        let t = this;
        t.BarHp.active = true;
        t.BarHp.setWorldRotation(t.dirHp);

    }


    eventDieChar() {
        let t = this;
        t.node.destroy()
    }



    update(deltaTime: number) {

    }
}

