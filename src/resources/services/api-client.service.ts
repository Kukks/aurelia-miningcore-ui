import {HttpClient} from "aurelia-http-client";

export class ApiClientService {
  public http: HttpClient;

  constructor() {
    let url = window.location.origin;//"http://5.189.159.254";
    if ((url.match(/:/g) || []).length > 1) {
      url = url.substr(0, url.lastIndexOf(":"));
    }

    this.http = new HttpClient().configure(
      builder =>
        builder.withBaseUrl(`${url}:4000/api`));
  }
}
