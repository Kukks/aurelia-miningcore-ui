import {View, viewEngineHooks, ViewEngineHooks} from "aurelia-templating";
import {autoinject} from "aurelia-dependency-injection";
import {RouteMapper} from "./services/route-mapper.service";
import * as moment from "moment";
@viewEngineHooks()
@autoinject()
export class ViewGlobals implements ViewEngineHooks {

  constructor(private routeMapper: RouteMapper) {
  }

  public beforeBind(view: View) {
    view.overrideContext["routeMapper"] = this.routeMapper;
    view.overrideContext["moment"] = moment;
  }
}
