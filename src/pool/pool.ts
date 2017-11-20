import {autoinject} from "aurelia-framework";
@autoinject
export class PoolPage {

  public id: string;
  public miner: string;

  public activate(params: {id: string, miner?:string}) {
    this.id = params.id;
    debugger;
    this.miner = params.miner;
  }
}


