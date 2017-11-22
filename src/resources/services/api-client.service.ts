import {HttpClient} from "aurelia-http-client";

export class ApiClientService {
  public http: HttpClient;

  constructor() {
    this.http = new HttpClient().configure(builder => builder.withBaseUrl(`${window.location.origin}:4000/api`));
  }
}
