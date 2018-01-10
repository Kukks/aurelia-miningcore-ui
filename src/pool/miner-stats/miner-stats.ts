import * as moment from "moment";
import { ApiClientService } from "../../resources/services/api-client.service";
import { LoaderService } from "../../resources/services/loader.service";
import { HttpResponseMessage } from "aurelia-http-client";
import { bindable, autoinject, TaskQueue } from "aurelia-framework";
import Chart from "chart.js"
import { HashCalculatorService } from "resources/services/hash-calculator.service";


@autoinject
export class MinerStats {
  @bindable
  public id: string;
  @bindable
  public address: string;
  public data?: PoolMinerStat;
  public error: boolean = false;
  public chartMiner: HTMLCanvasElement;

  private charthart: Chart;

  public get minerChartConfig() {
    if (!this.data || !this.data.hashrate) {
      return null;
    }

    return {
      maintainAspectRatio: true,
      responsive: true,
      animation: !!this.charthart,
      type: 'line',
      data: {
        labels: this.data.hashrate.reverse().map(x => moment(x.created).fromNow()),
        datasets: [
          {
            label: "Hashrate",
            data: this.data.hashrate.reverse().map(x => x.hashrate),
            backgroundColor: "rgba(151,187,205,0.2)",
            borderColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)"
          }
        ]
      },
      options: {
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              return HashCalculatorService.formatHashRate(tooltipItem.yLabel);
            }
          }
        },
        scales: {
          xAxes: [{
            time: {
              unit: 'hour',
              unitStepSize: 1,
            }
          }],
          yAxes: [{
            ticks: {
              callback: (value, index, values) => {
                return HashCalculatorService.formatHashRate(value);
              }
            }
          }]
        }
      }
    };
  }

  constructor(private apiClientService: ApiClientService, private loadingService: LoaderService, private taskQueue: TaskQueue) {

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
    this.error = false;
    return this.apiClientService.http.get(`pools/${this.id}/miners/${this.address}`, ).then((value: HttpResponseMessage) => {
      if (value.isSuccess) {
        if (value && this.data && JSON.stringify(value) === JSON.stringify(this.data)) {
          return;
        }
        this.data = value.content;

        this.taskQueue.queueMicroTask(() => {
          if (!this.chartMiner) {
            return;
          }
          if (this.charthart) {
            this.charthart.destroy();
          }
          if (this.minerChartConfig) {
            this.charthart = new Chart(this.chartMiner, this.minerChartConfig);
          }
        })
      } else {
        this.error = true;
      }


    }).catch(() => {
      this.error = true;
    }).then(x => {
      setTimeout(this.bind.bind(this), 4000);
    });
  }
}

export interface PoolMinerStat {
  pendingShares: number;
  pendingBalance: number;
  totalPaid: number;
  lastPayment: string;
  lastPaymentLink: string;
  hashrate: PoolMinerStatHashrate[];
  performance: PoolMinerPerformance;
}
export interface PoolMinerStatHashrate {
  poolId: string;
  miner: string;
  hashrate: number;
  created: string;
}
export interface PoolMinerPerformance {
  created: string;
  workers: { [index: string]: PoolMinerWorkerPerformance };
}
export interface PoolMinerWorkerPerformance {
  hashrate: number;
  sharesPerSecond: number;
}
