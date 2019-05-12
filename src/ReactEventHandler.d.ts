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
declare enum MODE {
    GLOBAL = 0,
    SINGLE = 1
}
/**
 * @description web端的事件监听发射控制器
 * @author peter.yuan
 * @class ReactEeventHandler
 * @implements {BaseEventHandler}
 */
declare class ReactEeventHandler {
    eventMap: object;
    mode: MODE;
    moduleName: string;
    isClassComponent: boolean;
    constructor(mode: MODE, moduleName?: string, isClassComponent?: boolean);
    /**
     * @description 是否存在该模块
     * @author peter.yuan
     * @private
     * @param {string} moduleName
     * @returns {boolean}
     * @memberof ReactEeventHandler
     */
    private hasCurrentModule;
    /**
     * @description 根据模式选择moduleName的来源
     * @author peter.yuan
     * @private
     * @param {*} opt
     * @returns
     * @memberof ReactEeventHandler
     */
    private getModuleName;
    /**
     * @description 判断是不是EventOpt类型数据
     * @author peter.yuan
     * @private
     * @param {*} opt
     * @returns {opt is EventOpt}
     * @memberof ReactEeventHandler
     */
    private isEventOpt;
    /**
     * @description 监听某模块下的某事件
     * @author peter.yuan
     * @param {EventOpt} opt
     * @param {Function} event
     * @memberof ReactEeventHandler
     */
    on(opt: EventOpt | string, event: Function): void;
    /**
     * @description 执行某模块下的某事件
     * @author peter.yuan
     * @param {EventOpt} opt
     * @param {*} args
     * @memberof ReactEeventHandler
     */
    emit(opt: EventOpt | string, ...args: any[]): void;
    /**
     * @description 延迟执行某事件 默认时长3000毫秒
     * @author peter.yuan
     * @param {EmitDelayOpt} opt
     * @param {*} args
     * @memberof ReactEeventHandler
     */
    emitDelay(opt: EmitDelayOpt, ...args: any[]): void;
    /**
     * @description 取消监听某模块下的某事件
     * @author peter.yuan
     * @param {EventOpt} opt
     * @memberof ReactEeventHandler
     */
    off(opt: EventOpt | string): void;
    /**
     * @description 取消所有模块下的所有事件
     * @author peter.yuan
     * @memberof ReactEeventHandler
     */
    offAll(): void;
    /**
     * @description 指定取消监听某些模块下的事件
     * @author peter.yuan
     * @param {string[]} moduleNames
     * @memberof ReactEeventHandler
     */
    offByModule(moduleNames: string[]): void;
}
declare const reh: ReactEeventHandler;
/**
 * @description 装饰器方法
 * @author peter.yuan
 * @param {*} target
 */
declare function useReactEventHandler(target: any): any;
export { useReactEventHandler };
export default reh;
