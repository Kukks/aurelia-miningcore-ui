import {autoinject} from "aurelia-framework";
import {ApiClientService} from "../resources/services/api-client.service";

@autoinject
export class Pool {

  constructor(private apiClientService: ApiClientService){

  }


}


