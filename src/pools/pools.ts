import {autoinject} from "aurelia-framework";
import {ApiClientService} from "../resources/services/api-client.service";
import {LoaderService} from "../resources/services/loader.service";
import {HttpResponseMessage} from "aurelia-http-client";

@autoinject
export class Pools {

  public get baseUrl():string{
    return window.location.hostname;
  }

  public data?: PoolsApiResult;
  public error: boolean = false;

  constructor(private apiClientService: ApiClientService, private loadingService: LoaderService) {

  }

  public activate() {
    this.data = null;
    this.error = false;
    this.loadingService.toggleLoading(true);
    this.apiClientService.http.get("pools").then((value: HttpResponseMessage) => {
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

export interface Coin {
  type: string;
}

export interface VarDiff {
  minDiff: number;
  maxDiff: number;
  targetTime: number;
  retargetTime: number;
  variancePercent: number;
}

export type Ports = {
  [index: number]: {
    difficulty: number;
    varDiff?: VarDiff;
  }
};

export interface PayoutSchemeConfig {
  factor: number;
}

export interface PaymentProcessing {
  enabled: boolean;
  minimumPayment: number;
  payoutScheme: string;
  payoutSchemeConfig: PayoutSchemeConfig;
  minimumPaymentToPaymentId: number;
}

export interface Banning {
  enabled: boolean;
  checkThreshold: number;
  invalidPercent: number;
  time: number;
}

export interface PoolStats {
  connectedMiners: number;
  poolHashRate: number;
}

export interface NetworkStats {
  networkType: string;
  networkHashRate: number;
  networkDifficulty: number;
  lastNetworkBlockTime: Date;
  blockHeight: number;
  connectedPeers: number;
  rewardType: string;
}

export interface Pool {
  id: string;
  coin: Coin;
  ports: Ports;
  paymentProcessing: PaymentProcessing;
  banning: Banning;
  clientConnectionTimeout: number;
  jobRebroadcastTimeout: number;
  blockRefreshInterval: number;
  poolFeePercent: number;
  address: string;
  addressInfoLink: string;
  poolStats: PoolStats;
  networkStats: NetworkStats;
}

export interface PoolsApiResult {
  pools: Pool[];
}


