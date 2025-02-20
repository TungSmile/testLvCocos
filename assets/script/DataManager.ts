import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DataManager')
export class DataManager extends Component {
    private static _instance: any = null;
    static getInstance<T>(): T {
        if (this._instance === null) {
            this._instance = new this()
        }
        return this._instance
    }

    static get instance() {
        return this.getInstance<DataManager>()
    }

    countDone: number = 0;
    countFail: number = 0;
    done: boolean = false;
    numberMoney: number = 0;
    slotStore: number = 4;
    slotFight: number = 4;
    hpSolider1:number=100;

}

