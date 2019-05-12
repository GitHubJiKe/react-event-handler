/**
 * @description 基础事件配置
 * @author peter.yuan
 * @interface EventOpt
 */
interface EventOpt {
  /**
   * @description 模块名
   * @type {string}
   * @memberof EventOpt
   */
  moduleName: string;
  /**
   * @description 事件名
   * @type {string}
   * @memberof EventOpt
   */
  eventName: string;
  /**
   * @description 是否只执行一次
   * @type {boolean}
   * @memberof EventOpt
   */
  onlyOnce?: boolean;
}

interface EmitDelayOpt extends EventOpt {
  timeout?: number;
}
/**
 * @description 模式
 * @enum {number}
 */
enum MODE {
  GLOBAL,
  SINGLE
}
/**
 * @description web端的事件监听发射控制器
 * @author peter.yuan
 * @class ReactEeventHandler
 * @implements {BaseEventHandler}
 */
class ReactEeventHandler {
  eventMap: object = {};
  mode: MODE;
  moduleName: string;
  isClassComponent: boolean;
  constructor(mode: MODE, moduleName?: string, isClassComponent?: boolean) {
    this.eventMap = {};
    this.mode = mode;
    this.moduleName = typeof moduleName === "string" ? moduleName : "Global";
    this.isClassComponent =
      typeof isClassComponent === "boolean" ? isClassComponent : false;
  }
  /**
   * @description 是否存在该模块
   * @author peter.yuan
   * @private
   * @param {string} moduleName
   * @returns {boolean}
   * @memberof ReactEeventHandler
   */
  private hasCurrentModule(moduleName: string): boolean {
    if (this.eventMap[moduleName]) {
      return true;
    } else {
      return false;
    }
  }
  /**
   * @description 根据模式选择moduleName的来源
   * @author peter.yuan
   * @private
   * @param {*} opt
   * @returns
   * @memberof ReactEeventHandler
   */
  private getModuleName(opt): string {
    return this.mode === MODE.GLOBAL ? opt.moduleName : this.moduleName;
  }
  /**
   * @description 判断是不是EventOpt类型数据
   * @author peter.yuan
   * @private
   * @param {*} opt
   * @returns {opt is EventOpt}
   * @memberof ReactEeventHandler
   */
  private isEventOpt(opt: any): opt is EventOpt {
    return typeof (opt as EventOpt)["eventName"] !== "undefined";
  }

  /**
   * @description 监听某模块下的某事件
   * @author peter.yuan
   * @param {EventOpt} opt
   * @param {Function} event
   * @memberof ReactEeventHandler
   */
  public on(opt: EventOpt | string, event: Function): void {
    let eventName = this.isEventOpt(opt) ? opt.eventName : opt;
    let moduleName = this.getModuleName(opt);
    let _module = this.eventMap[moduleName];
    if (!this.hasCurrentModule(moduleName)) _module = {};
    if (!_module[eventName]) _module[eventName] = [];
    if (this.isClassComponent) {
      _module[eventName].push(event);
    } else {
      _module[eventName].length === 0 ? _module[eventName].push(event) : "";
    }
    this.eventMap[moduleName] = _module;
  }

  /**
   * @description 执行某模块下的某事件
   * @author peter.yuan
   * @param {EventOpt} opt
   * @param {*} args
   * @memberof ReactEeventHandler
   */
  public emit(opt: EventOpt | string, ...args): void {
    let eventName = this.isEventOpt(opt) ? opt.eventName : opt;
    const moduleName = this.getModuleName(opt);
    if (this.hasCurrentModule(moduleName)) {
      this.eventMap[moduleName][eventName]
        ? this.eventMap[moduleName][eventName].forEach(fn => fn(...args))
        : console.log("当前模块下未监听该事件");
      if (this.isEventOpt(opt) && opt.onlyOnce) this.off(opt);
    } else {
      console.log("执行了一个未监听的的事件");
    }
  }
  /**
   * @description 延迟执行某事件 默认时长3000毫秒
   * @author peter.yuan
   * @param {EmitDelayOpt} opt
   * @param {*} args
   * @memberof ReactEeventHandler
   */
  public emitDelay(opt: EmitDelayOpt, ...args): void {
    let timeout = opt.timeout ? opt.timeout : 3000;
    setTimeout(() => this.emit(opt, ...args), timeout);
  }

  /**
   * @description 取消监听某模块下的某事件
   * @author peter.yuan
   * @param {EventOpt} opt
   * @memberof ReactEeventHandler
   */
  public off(opt: EventOpt | string): void {
    let eventName = this.isEventOpt(opt) ? opt.eventName : opt;
    const moduleName = this.getModuleName(opt);
    if (this.hasCurrentModule(moduleName)) {
      this.eventMap[moduleName][eventName] = null;
      delete this.eventMap[moduleName][eventName];
    } else {
      console.log("事件发射器上并未监听该事件");
    }
  }
  /**
   * @description 取消所有模块下的所有事件
   * @author peter.yuan
   * @memberof ReactEeventHandler
   */
  public offAll(): void {
    this.eventMap = {};
  }
  /**
   * @description 指定取消监听某些模块下的事件
   * @author peter.yuan
   * @param {string[]} moduleNames
   * @memberof ReactEeventHandler
   */
  public offByModule(moduleNames: string[]): void {
    if (
      !Array.isArray(moduleNames) &&
      typeof moduleNames === "string" &&
      moduleNames !== ""
    ) {
      moduleNames = [moduleNames];
    } else {
      throw new Error(
        "参数类型异常，请检查入参类型是否合法,合法类型是string/string[]"
      );
    }
    moduleNames.forEach(moduleName => {
      if (this.hasCurrentModule(moduleName)) {
        this.eventMap[moduleName] = null;
        delete this.eventMap[moduleName];
      }
    });
  }
}

const reh = new ReactEeventHandler(MODE.GLOBAL);
/**
 * @description 装饰器方法
 * @author peter.yuan
 * @param {*} target
 */
function useReactEventHandler(target: any) {
  const isClassComponent = target.prototype !== undefined;
  target.$reh = new ReactEeventHandler(
    MODE.SINGLE,
    target.name,
    isClassComponent
  );
  return target;
}
export { useReactEventHandler };
export default reh;
