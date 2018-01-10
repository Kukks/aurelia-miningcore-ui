import { autoinject } from "aurelia-framework";
import { observable } from "aurelia-binding";
import { Pool, PoolsApiResult } from "../pools/pools";
import { LoaderService } from "../resources/services/loader.service";
import { ApiClientService } from "../resources/services/api-client.service";
import { HttpResponseMessage } from "aurelia-http-client";

@autoinject
export class PoolPage {
  @observable
  public id: string;
  @observable()
  public miner: string;
  public minerNew: string;

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
    // this.data = null;
    this.error = false;
    const id = this.id;
    return this.apiClientService.http.get(`pools`, ).then((value: HttpResponseMessage) => {
      if (value.isSuccess) {
        this.data = (value.content as PoolsApiResult).pools.find(x => x.id === id);
        setTimeout(this.idChanged.bind(this), 2000);
      } else {
        this.error = true;
      }
    }).catch(() => {
      this.error = true;
    });
  }

  public minerChanged() {
    this.minerNew = this.miner;
  }
}


