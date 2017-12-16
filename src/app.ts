import {RouteConfig, Router, ConfiguresRouter, RouterConfiguration} from "aurelia-router";
import {PLATFORM, bindable, autoinject} from "aurelia-framework";
import {RouteMapper} from "./resources/services/route-mapper.service";
import environment from "./environment";


@autoinject()
export class App implements ConfiguresRouter {

  public static Routes: RouteConfig[] = [
    {
      route: ['/','pools/'],
      name: 'pools',
      moduleId: PLATFORM.moduleName('./pools/pools'),
      nav: true,
      title: 'Pools',
      settings: {}
    },
    {
      route: ['pools/:id/:miner?'],
      name: 'pool',
      moduleId: PLATFORM.moduleName('./pool/pool'),
      nav: false,
      title: 'Pool',
      settings: {}
    }
  ];


  @bindable
  public router: Router;

  constructor(private routeMapper: RouteMapper) {

  }

  public configureRouter(config: RouterConfiguration, router: Router): void | Promise<void> | PromiseLike<void> {
    config.options.pushState = true;
    config.title = "Gozo Pool";
    const routes = App.Routes;
    config.map(routes);

    this.routeMapper.map(routes);
    config.mapUnknownRoutes(PLATFORM.moduleName("./404/index"));
    this.router = router;
  }
}
