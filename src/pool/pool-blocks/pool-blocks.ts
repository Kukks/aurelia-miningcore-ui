import { ApiClientService } from "../../resources/services/api-client.service";
import { LoaderService } from "../../resources/services/loader.service";
import { HttpResponseMessage } from "aurelia-http-client";
import { bindable, autoinject, observable } from "aurelia-framework";
import { buildQueryString } from "aurelia-path";
import { clearTimeout } from "timers";

@autoinject
export class PoolBlocks {

  @bindable
  public poolId: string;
  public data?: PoolBlockItem[] = [];
  public error: boolean = false;
  @observable
  public currentPageNumber: number = 0;
  @observable
  public pageSize: number = 5;
  public loading: boolean = false;
  private timeout;

  public get allowNext(): boolean {

    if (this.data.length < ((this.currentPageNumber + 1) * this.pageSize)) {
      return false;
    }
    return true;
  }

  constructor(private apiClientService: ApiClientService, private loadingService: LoaderService) {

  }

  public nextPage() {
    if (this.loading) {
      return false;
    }
    this.currentPageNumber++;
  }

  public refresh() {
    if (this.loading) {
      return false;
    }
    const newPageSize = (this.currentPageNumber + 1) * this.pageSize;
    if (newPageSize === this.pageSize) {
      this.currentPageNumber = -1;
    } else {
      this.pageSize = (this.currentPageNumber + 1) * this.pageSize;
    }
  }

  public poolIdChanged() {
    this.currentPageNumber = -1;
  }

  public pageSizeChanged() {
    this.currentPageNumber = -1;
  }

  public currentPageNumberChanged() {
    if (this.currentPageNumber < 0) {
      this.currentPageNumber = 0;
      return;
    }

    this.bind();
  }

  public bind() {

    this.loading = true;
    if (!this.poolId) {
      return;
    }
    if (this.timeout) {
      try {
        clearTimeout(this.timeout);
      } catch{ }
    }
    this.error = false;
    let options = {
      pageSize: this.pageSize,
      page: this.currentPageNumber
    }


    this.apiClientService.http.get(`pools/${this.poolId}/blocks?${buildQueryString(options, true)}`).then((value: HttpResponseMessage) => {
      if (value.isSuccess) {
        if (this.currentPageNumber === 0) {
          this.data = [];
        }
        this.data = [...this.data, ...value.content];
      } else {
        this.error = true;
      }
    }).catch(() => {
      this.error = true;
    }).then(() => {
      this.loading = false;
      this.timeout = setTimeout(this.refresh.bind(this), 4000);
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
