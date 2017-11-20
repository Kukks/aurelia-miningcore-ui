import {ApiClientService} from "../../resources/services/api-client.service";
import {LoaderService} from "../../resources/services/loader.service";
import {HttpResponseMessage} from "aurelia-http-client";
import {bindable, autoinject, observable} from "aurelia-framework";

@autoinject
export class PoolBlocks {
  @bindable
  public id: string;
  public data?: PoolBlockItem[];
  public error: boolean = false;
  @observable
  public currentPageNumber: number = 1;
  @observable
  public pageSize: number = 5;

  public get allowNext():boolean{
    if(this.data && this.data.length >= this.pageSize){
      return true;
    }
    return false;
  }

  constructor(private apiClientService: ApiClientService, private loadingService: LoaderService) {

  }

  public idChanged() {
    this.bind();
  }

  public pageSizeChanged() {
    this.currentPageNumber = 1;
  }

  public currentPageNumberChanged() {
    this.bind();
  }

  public bind() {
    if (!this.id) {
      return;
    }
    this.data = null;
    this.error = false;
    this.loadingService.toggleLoading(true);
    this.apiClientService.http.get(`pool/${this.id}/blocks`,).then((value: HttpResponseMessage) => {
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

export interface PoolBlockItem {
  blockHeight: number;
  status: string;
  effort: number;
  confirmationProgress: number;
  transactionConfirmationData: string;
  reward: number;
  infoLink: string;
  created: string;
}
