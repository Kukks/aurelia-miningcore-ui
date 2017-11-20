import {FrameworkConfiguration} from 'aurelia-framework';
import {PLATFORM} from "aurelia-pal";

export function configure(config: FrameworkConfiguration) {

  config.globalResources([
    PLATFORM.moduleName("./hooks"),
    PLATFORM.moduleName("./value-converters/objectkeys.value-converter"),
    PLATFORM.moduleName("./value-converters/stringify"),
    PLATFORM.moduleName("./elements/full-loader/full-loader"),
  ]);
}
