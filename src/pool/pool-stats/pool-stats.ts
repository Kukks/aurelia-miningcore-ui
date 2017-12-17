
import {HttpResponseMessage} from "aurelia-http-client";
import {bindable, autoinject, observable, computedFrom} from "aurelia-framework";
import {TaskQueue} from "aurelia-task-queue";
import Chart from "chart.js"
import * as moment from "moment";
import {ApiClientService} from "../../resources/services/api-client.service";
import {LoaderService} from "../../resources/services/loader.service";
@autoinject
export class PoolStats {
  public chartHash: HTMLCanvasElement;
  public chartMiners: HTMLCanvasElement;

  public get minerChartConfig() {
    if (!this.data || !this.data.stats) {
      return null;
    }

    return {
      maintainAspectRatio: true,
      responsive: true,
      type: 'line',
      data: {
        labels: this.data.stats.map(value => moment(value.created).format("ddd, hA")),
        datasets: [
          {
            label: "Miners",
            data: this.data.stats.map(value => value.connectedMiners),
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
          xAxes: [{
            time: {
              unit: 'hour',
              unitStepSize: 1,
            }
          }]
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
      type: 'line',
      data: {
        labels: this.data.stats.map(value => moment(value.created).format("ddd, hA")),
        datasets: [
          {
            label: "Hashrate",
            data: this.data.stats.map(value => value.poolHashRate),
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
          xAxes: [{
            time: {
              unit: 'hour',
              unitStepSize: 1,
            }
          }]
        }
      }
    };
  }

  public get chartHashData() {
    if (!this.data || !this.data.stats) {
      return null;
    }
    const result = {
      datasets: [
        {
          label: "Hash Rate",
          data: this.data.stats.map(value => value.poolHashRate),
          backgroundColor: "rgba(220,220,220,0.2)",
          borderColor: "rgba(220,220,220,1)",
          pointColor: "rgba(220,220,220,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(220,220,220,1)",
        }
      ]
    }
    return result;
  }

  @bindable
  public id: string;
  @observable()
  public data?: PoolStats;
  public error: boolean = false;

  constructor(private apiClientService: ApiClientService, private loadingService: LoaderService, private taskQueue: TaskQueue) {

  }

  public attached() {
    this.dataChanged();
  }

  public dataChanged() {
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
      new Chart(this.chartMiners, this.minerChartConfig);
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
      new Chart(this.chartHash, this.hashrateChartConfig);
    })
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
    this.apiClientService.http.get(`pools/${this.id}/stats/hourly`,).then((value: HttpResponseMessage) => {
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
