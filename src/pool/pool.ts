import {autoinject} from "aurelia-framework";
import {observable} from "aurelia-binding";
import {Pool} from "../pools/pools";
import {LoaderService} from "../resources/services/loader.service";
import {ApiClientService} from "../resources/services/api-client.service";
import {HttpResponseMessage} from "aurelia-http-client";

@autoinject
export class PoolPage {
  @observable
  public id: string;
  public miner: string;

  public error: boolean = false;
  public data: Pool;

  constructor(private apiClientService: ApiClientService, private loadingService: LoaderService) {

  }

  public activate(params: { id: string, miner?: string }) {
    this.id = params.id;
    this.miner = params.miner;
  }

  public idChanged() {
    if (!this.id) {
      return;
    }
    this.data = null;
    this.error = false;
    this.loadingService.toggleLoading(true);
    this.apiClientService.http.get(`pools/${this.id}`,).then((value: HttpResponseMessage) => {
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


