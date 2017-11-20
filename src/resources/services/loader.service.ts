import {autoinject} from "aurelia-dependency-injection";
import {Router} from "aurelia-router";
import {EventAggregator} from "aurelia-event-aggregator";

@autoinject
export class LoaderService {

  private routerLoading: boolean = true;

  public get isLoading(): boolean {
    return this.manualLoading || this.router.isNavigating;
  }

  private manualLoading: boolean = false;

  constructor(private router: Router, private ea: EventAggregator) {
    ea.subscribe('router:navigation:processing', () => {
      this.routerLoading = true;
    });
    ea.subscribe('router:navigation:complete', () => {
      this.routerLoading = false;
    });
  }

  public toggleLoading(value: boolean) {
    this.manualLoading = value;
  }
}
