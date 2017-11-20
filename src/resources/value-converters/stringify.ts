export class StringifyValueConverter {

  public toView(value: any) {
    if (value == null) {
      return "";
    }
    if (typeof value == "string") {
      return value;
    }
    return JSON.stringify(value);
  }
}
