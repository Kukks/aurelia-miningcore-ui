export class Status {
  public bind() {
    let scriptURL = "https://platform.twitter.com/widgets.js";

    let scriptElement = document.createElement('script');

    scriptElement.src = scriptURL;
    document.querySelector('head').appendChild(scriptElement);
  }
}
