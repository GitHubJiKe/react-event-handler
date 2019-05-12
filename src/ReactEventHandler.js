"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @description 模式
 * @enum {number}
 */
var MODE;
(function (MODE) {
    MODE[MODE["GLOBAL"] = 0] = "GLOBAL";
    MODE[MODE["SINGLE"] = 1] = "SINGLE";
})(MODE || (MODE = {}));
/**
 * @description web端的事件监听发射控制器
 * @author peter.yuan
 * @class ReactEeventHandler
 * @implements {BaseEventHandler}
 */
var ReactEeventHandler = /** @class */ (function () {
    function ReactEeventHandler(mode, moduleName, isClassComponent) {
        this.eventMap = {};
        this.eventMap = {};
        this.mode = mode;
        this.moduleName = typeof moduleName === "string" ? moduleName : "Global";
        this.isClassComponent =
            typeof isClassComponent === "boolean" ? isClassComponent : true;
    }
    /**
     * @description 是否存在该模块
     * @author peter.yuan
     * @private
     * @param {string} moduleName
     * @returns {boolean}
     * @memberof ReactEeventHandler
     */
    ReactEeventHandler.prototype.hasCurrentModule = function (moduleName) {
        if (this.eventMap[moduleName]) {
            return true;
        }
        else {
            return false;
        }
    };
    /**
     * @description 根据模式选择moduleName的来源
     * @author peter.yuan
     * @private
     * @param {*} opt
     * @returns
     * @memberof ReactEeventHandler
     */
    ReactEeventHandler.prototype.getModuleName = function (opt) {
        return this.mode === MODE.GLOBAL ? opt.moduleName : this.moduleName;
    };
    /**
     * @description 判断是不是EventOpt类型数据
     * @author peter.yuan
     * @private
     * @param {*} opt
     * @returns {opt is EventOpt}
     * @memberof ReactEeventHandler
     */
    ReactEeventHandler.prototype.isEventOpt = function (opt) {
        return typeof opt["eventName"] !== "undefined";
    };
    /**
     * @description 监听某模块下的某事件
     * @author peter.yuan
     * @param {EventOpt} opt
     * @param {Function} event
     * @memberof ReactEeventHandler
     */
    ReactEeventHandler.prototype.on = function (opt, event) {
        var eventName = this.isEventOpt(opt) ? opt.eventName : opt;
        var moduleName = this.getModuleName(opt);
        var _module = this.eventMap[moduleName];
        if (!this.hasCurrentModule(moduleName))
            _module = {};
        if (!_module[eventName])
            _module[eventName] = [];
        if (this.isClassComponent) {
            _module[eventName].push(event);
        }
        else {
            _module[eventName].length === 0 ? _module[eventName].push(event) : "";
        }
        this.eventMap[moduleName] = _module;
    };
    /**
     * @description 执行某模块下的某事件
     * @author peter.yuan
     * @param {EventOpt} opt
     * @param {*} args
     * @memberof ReactEeventHandler
     */
    ReactEeventHandler.prototype.emit = function (opt) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var eventName = this.isEventOpt(opt) ? opt.eventName : opt;
        var moduleName = this.getModuleName(opt);
        if (this.hasCurrentModule(moduleName)) {
            this.eventMap[moduleName][eventName]
                ? this.eventMap[moduleName][eventName].forEach(function (fn) { return fn.apply(void 0, args); })
                : console.log("当前模块下未监听该事件");
            if (this.isEventOpt(opt) && opt.onlyOnce)
                this.off(opt);
        }
        else {
            console.log("执行了一个未监听的的事件");
        }
    };
    /**
     * @description 延迟执行某事件 默认时长3000毫秒
     * @author peter.yuan
     * @param {EmitDelayOpt} opt
     * @param {*} args
     * @memberof ReactEeventHandler
     */
    ReactEeventHandler.prototype.emitDelay = function (opt) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var timeout = opt.timeout ? opt.timeout : 3000;
        setTimeout(function () { return _this.emit.apply(_this, [opt].concat(args)); }, timeout);
    };
    /**
     * @description 取消监听某模块下的某事件
     * @author peter.yuan
     * @param {EventOpt} opt
     * @memberof ReactEeventHandler
     */
    ReactEeventHandler.prototype.off = function (opt) {
        var eventName = this.isEventOpt(opt) ? opt.eventName : opt;
        var moduleName = this.getModuleName(opt);
        if (this.hasCurrentModule(moduleName)) {
            this.eventMap[moduleName][eventName] = null;
            delete this.eventMap[moduleName][eventName];
        }
        else {
            console.log("事件发射器上并未监听该事件");
        }
    };
    /**
     * @description 取消所有模块下的所有事件
     * @author peter.yuan
     * @memberof ReactEeventHandler
     */
    ReactEeventHandler.prototype.offAll = function () {
        this.eventMap = {};
    };
    /**
     * @description 指定取消监听某些模块下的事件
     * @author peter.yuan
     * @param {string[]} moduleNames
     * @memberof ReactEeventHandler
     */
    ReactEeventHandler.prototype.offByModule = function (moduleNames) {
        var _this = this;
        if (!Array.isArray(moduleNames) &&
            typeof moduleNames === "string" &&
            moduleNames !== "") {
            moduleNames = [moduleNames];
        }
        else {
            throw new Error("参数类型异常，请检查入参类型是否合法,合法类型是string/string[]");
        }
        moduleNames.forEach(function (moduleName) {
            if (_this.hasCurrentModule(moduleName)) {
                _this.eventMap[moduleName] = null;
                delete _this.eventMap[moduleName];
            }
        });
    };
    return ReactEeventHandler;
}());
var reh = new ReactEeventHandler(MODE.GLOBAL);
/**
 * @description 装饰器方法
 * @author peter.yuan
 * @param {*} target
 */
function useReactEventHandler(target) {
    var isClassComponent = target.prototype !== undefined;
    target.$reh = new ReactEeventHandler(MODE.SINGLE, target.name, isClassComponent);
    return target;
}
exports.useReactEventHandler = useReactEventHandler;
exports.default = reh;
//# sourceMappingURL=ReactEventHandler.js.map