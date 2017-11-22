import {Pool} from "../../../pools/pools";
import {bindable} from "aurelia-framework";

export class PoolInfo {
  @bindable
  public pool: Pool;

  public get baseUrl(): string {
    return window.location.hostname;
  }

}
