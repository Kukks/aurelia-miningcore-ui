import {RouteConfig} from "aurelia-router";
import {RouteRecognizer} from "aurelia-route-recognizer";

export class RouteMapper extends RouteRecognizer {

  public map(routes: RouteConfig[], parentName = '', parentRoute = ''): void {
    routes.forEach(config => {
      const currentRoute = Array.isArray(config.route)? config.route[0] : config.route;
      let name = parentName ? `${parentName}/${config.name}` : config.name;
      let path = parentRoute + currentRoute;
      this.add({
        path: path,
        handler: { name: name },
        caseSensitive: config.caseSensitive === true
      });
      if (config.settings && config.settings.childRoutes) {
        this.map(config.settings.childRoutes, name, path);
      }
    });
  }
}
