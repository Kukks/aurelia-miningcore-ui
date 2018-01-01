
import { HttpResponseMessage } from "aurelia-http-client";
import { bindable, autoinject, observable, computedFrom } from "aurelia-framework";
import { TaskQueue } from "aurelia-task-queue";
import Chart from "chart.js"
import * as moment from "moment";
import { ApiClientService } from "../../resources/services/api-client.service";
import { LoaderService } from "../../resources/services/loader.service";
import { HashCalculatorService } from "../../resources/services/hash-calculator.service";
@autoinject
export class PoolStats {
  public chartHash: HTMLCanvasElement;
  public chartMiners: HTMLCanvasElement;
  @bindable
  public id: string;
  @observable()
  public data?: PoolStatsData;
  public error: boolean = false;


  private poolHashRateData: number[] = [];
  private poolMinereData: number[] = [];
  private poolTimeData: string[] = [];
  private minerChart: Chart;
  private hashChart: Chart;


  public get minerChartConfig() {
    if (!this.data || !this.data.stats) {
      return null;
    }

    return {
      maintainAspectRatio: true,
      responsive: true,
      animation: !!this.minerChart,
      type: 'line',
      data: {
        labels: this.poolTimeData,
        datasets: [
          {
            label: "Miners",
            data: this.poolMinereData,
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
        scales: {
          yAxes: [
            {
              ticks: {
                stepSize: 1,
                suggestedMin: 0
              }
            }
          ],
          xAxes: [{
            time: {
              unit: 'hour',
              unitStepSize: 1,
            }
          }],

        }
      }
    };
  }
  public get hashrateChartConfig() {
    if (!this.data || !this.data.stats) {
      return null;
    }

    return {
      maintainAspectRatio: true,
      responsive: true,
      animation: !!this.hashChart,
      type: 'line',
      data: {
        labels: this.poolTimeData,
        datasets: [
          {
            label: "Hashrate",
            data: this.poolHashRateData,
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

  public attached() {
    this.dataChanged();
  }

  public dataChanged(newVal?: PoolStatsData, oldVal?: PoolStatsData) {

    if (newVal && oldVal && JSON.stringify(newVal) === JSON.stringify(oldVal)) {
      return;
    }
    if(!this.data || !this.data.stats){
      return;
    }
    this.poolHashRateData.splice(0, this.poolHashRateData.length, ...this.data.stats.map(value => value.poolHashRate));
    this.poolMinereData.splice(0, this.poolMinereData.length, ...this.data.stats.map(value => value.connectedMiners));
    this.poolTimeData.splice(0, this.poolTimeData.length, ...this.data.stats.map(value => moment(value.created).format("ddd, hA")));

    this.handleHashrateChart();
    this.handleMinerChart();
  }


  private handleMinerChart() {
    if (!this.minerChartConfig) {
      return;
    }
    this.taskQueue.queueMicroTask(() => {
      if (!this.chartMiners) {
        return;
      }
      if (this.minerChart) {
        this.minerChart.destroy();
      }
      this.minerChart = new Chart(this.chartMiners, this.minerChartConfig);
    })
  }

  private handleHashrateChart() {
    if (!this.hashrateChartConfig) {
      return;
    }
    this.taskQueue.queueMicroTask(() => {
      if (!this.chartHash) {
        return;
      }
      if (this.hashChart) {
        this.hashChart.destroy();
      }
      this.hashChart = new Chart(this.chartHash, this.hashrateChartConfig);
    })
  }

  public idChanged() {
    this.bind();
  }

  public bind() {
    if (!this.id) {
      return;
    }
    this.error = false;
    this.apiClientService.http.get(`pools/${this.id}/stats/hourly`, ).then((value: HttpResponseMessage) => {
      if (value.isSuccess) {
        this.data = value.content;
      } else {
        this.error = true;
      }
    }).catch(() => {
      this.error = true;
    }).then(x => {
      setTimeout(this.bind.bind(this), 5000);
    })
  }

}

export interface PoolStatsData {
  stats: Stat[];
}

interface Stat {
  poolHashRate: number;
  connectedMiners: number;
  created: string;
}
