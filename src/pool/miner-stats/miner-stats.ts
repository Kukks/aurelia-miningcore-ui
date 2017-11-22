import {ApiClientService} from "../../resources/services/api-client.service";
import {LoaderService} from "../../resources/services/loader.service";
import {HttpResponseMessage} from "aurelia-http-client";
import {bindable, autoinject} from "aurelia-framework";

@autoinject
export class MinerStats {
  @bindable
  public id: string;
  @bindable
  public address: string;
  public data?: PoolMinerStat;
  public error: boolean = false;

  constructor(private apiClientService: ApiClientService, private loadingService: LoaderService) {

  }

  public idChanged() {
    this.bind();
  }

  public minerChanged() {
    this.bind();
  }
  public currentPageNumberChanged() {
    this.bind();
  }

  public bind() {
    if (!this.id || !this.address) {
      return;
    }
    this.data = null;
    this.error = false;
    this.loadingService.toggleLoading(true);
    this.apiClientService.http.get(`pool/${this.id}/miner/${this.address}/stats`,).then((value: HttpResponseMessage) => {
      if (value.isSuccess) {
        this.data = value.content;

      } else {
        this.error = true;
      }
    }).catch(() => {
      this.error = true;
    }).then(() => {
      this.loadingService.toggleLoading(false);
    })
  }

}

export interface PoolMinerStat {
  pendingShares: number;
  pendingBalance: number;
  totalPaid: number;
}
