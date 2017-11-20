import {autoinject} from "aurelia-dependency-injection";
import {LoaderService} from "../../services/loader.service";
import {bindable} from "aurelia-templating";

@autoinject
export class FullLoader {
  @bindable()
  public useLoaderService = true;

  public get show() {
    if(this.useLoaderService){
      return  this.loaderService.isLoading;
    }
    return true;
  }

  constructor(private loaderService: LoaderService) {
  }
}
