import {HttpClient} from "aurelia-http-client";

export class ApiClientService {
  public http: HttpClient;

  constructor() {
    this.http = new HttpClient().configure(builder => builder.withBaseUrl("http://localhost:4000/api"));
  }
}
