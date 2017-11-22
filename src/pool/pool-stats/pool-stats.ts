import {ApiClientService} from "../../resources/services/api-client.service";
import {LoaderService} from "../../resources/services/loader.service";
import {HttpResponseMessage} from "aurelia-http-client";
import {bindable, autoinject, observable, computedFrom} from "aurelia-framework";
import {TaskQueue} from "aurelia-task-queue";
import Chart from "chart.js"

@autoinject
export class PoolStats {
  public chart: HTMLCanvasElement;

  public get chartData() {
    if (!this.data || !this.data.stats) {
      return null;
    }
    const result = {
      labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
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
        },
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
  public attached(){
    this.dataChanged();
  }

  public dataChanged() {
    if (!this.chartData) {
      return;
    }
    this.taskQueue.queueMicroTask(() => {
      if(!this.chart){
        return;
      }
      var myChart = new Chart(this.chart, {
        type: 'line',
        data: this.chartData,
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });
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
