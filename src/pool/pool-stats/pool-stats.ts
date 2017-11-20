import {ApiClientService} from "../../resources/services/api-client.service";
import {LoaderService} from "../../resources/services/loader.service";
import {HttpResponseMessage} from "aurelia-http-client";
import {bindable, autoinject, observable} from "aurelia-framework";

@autoinject
export class PoolStats {
  @bindable
  public id: string;
  public data?: PoolStats;
  public error: boolean = false;

  constructor(private apiClientService: ApiClientService, private loadingService: LoaderService) {

  }

  public idChanged() {
    this.bind();
  }

  public bind() {
    if (!this.id) {
      return;
    }
    this.data = null;
    this.error = false;
    this.loadingService.toggleLoading(true);
    this.apiClientService.http.get(`pool/${this.id}/stats/hourly`,).then((value: HttpResponseMessage) => {
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

export interface PoolStats {
  stats: Stat[];
}

interface Stat {
  poolHashRate: number;
  connectedMiners: number;
  created: string;
}
