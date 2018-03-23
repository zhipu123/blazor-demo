/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var MonoPlatform_1 = __webpack_require__(5);
exports.platform = MonoPlatform_1.monoPlatform;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var InternalRegisteredFunction_1 = __webpack_require__(6);
var registeredFunctions = {};
function registerFunction(identifier, implementation) {
    if (InternalRegisteredFunction_1.internalRegisteredFunctions.hasOwnProperty(identifier)) {
        throw new Error("The function identifier '" + identifier + "' is reserved and cannot be registered.");
    }
    if (registeredFunctions.hasOwnProperty(identifier)) {
        throw new Error("A function with the identifier '" + identifier + "' has already been registered.");
    }
    registeredFunctions[identifier] = implementation;
}
exports.registerFunction = registerFunction;
function getRegisteredFunction(identifier) {
    // By prioritising the internal ones, we ensure you can't override them
    var result = InternalRegisteredFunction_1.internalRegisteredFunctions[identifier] || registeredFunctions[identifier];
    if (result) {
        return result;
    }
    else {
        throw new Error("Could not find registered function with name '" + identifier + "'.");
    }
}
exports.getRegisteredFunction = getRegisteredFunction;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function getAssemblyNameFromUrl(url) {
    var lastSegment = url.substring(url.lastIndexOf('/') + 1);
    var queryStringStartPos = lastSegment.indexOf('?');
    var filename = queryStringStartPos < 0 ? lastSegment : lastSegment.substring(0, queryStringStartPos);
    return filename.replace(/\.dll$/, '');
}
exports.getAssemblyNameFromUrl = getAssemblyNameFromUrl;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Environment_1 = __webpack_require__(0);
var RenderBatch_1 = __webpack_require__(8);
var BrowserRenderer_1 = __webpack_require__(9);
var browserRenderers = {};
function attachComponentToElement(browserRendererId, elementSelector, componentId) {
    var elementSelectorJs = Environment_1.platform.toJavaScriptString(elementSelector);
    var element = document.querySelector(elementSelectorJs);
    if (!element) {
        throw new Error("Could not find any element matching selector '" + elementSelectorJs + "'.");
    }
    var browserRenderer = browserRenderers[browserRendererId];
    if (!browserRenderer) {
        browserRenderer = browserRenderers[browserRendererId] = new BrowserRenderer_1.BrowserRenderer(browserRendererId);
    }
    browserRenderer.attachComponentToElement(componentId, element);
    clearElement(element);
}
exports.attachComponentToElement = attachComponentToElement;
function renderBatch(browserRendererId, batch) {
    var browserRenderer = browserRenderers[browserRendererId];
    if (!browserRenderer) {
        throw new Error("There is no browser renderer with ID " + browserRendererId + ".");
    }
    var updatedComponents = RenderBatch_1.renderBatch.updatedComponents(batch);
    var updatedComponentsLength = RenderBatch_1.arrayRange.count(updatedComponents);
    var updatedComponentsArray = RenderBatch_1.arrayRange.array(updatedComponents);
    var referenceFramesStruct = RenderBatch_1.renderBatch.referenceFrames(batch);
    var referenceFrames = RenderBatch_1.arrayRange.array(referenceFramesStruct);
    for (var i = 0; i < updatedComponentsLength; i++) {
        var diff = Environment_1.platform.getArrayEntryPtr(updatedComponentsArray, i, RenderBatch_1.renderTreeDiffStructLength);
        var componentId = RenderBatch_1.renderTreeDiff.componentId(diff);
        var editsArraySegment = RenderBatch_1.renderTreeDiff.edits(diff);
        var edits = RenderBatch_1.arraySegment.array(editsArraySegment);
        var editsOffset = RenderBatch_1.arraySegment.offset(editsArraySegment);
        var editsLength = RenderBatch_1.arraySegment.count(editsArraySegment);
        browserRenderer.updateComponent(componentId, edits, editsOffset, editsLength, referenceFrames);
    }
    var disposedComponentIds = RenderBatch_1.renderBatch.disposedComponentIds(batch);
    var disposedComponentIdsLength = RenderBatch_1.arrayRange.count(disposedComponentIds);
    var disposedComponentIdsArray = RenderBatch_1.arrayRange.array(disposedComponentIds);
    for (var i = 0; i < disposedComponentIdsLength; i++) {
        var componentIdPtr = Environment_1.platform.getArrayEntryPtr(disposedComponentIdsArray, i, 4);
        var componentId = Environment_1.platform.readInt32Field(componentIdPtr);
        browserRenderer.disposeComponent(componentId);
    }
}
exports.renderBatch = renderBatch;
function clearElement(element) {
    var childNode;
    while (childNode = element.firstChild) {
        element.removeChild(childNode);
    }
}


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Environment_1 = __webpack_require__(0);
var DotNet_1 = __webpack_require__(2);
__webpack_require__(3);
__webpack_require__(12);
__webpack_require__(13);
__webpack_require__(14);
function boot() {
    return __awaiter(this, void 0, void 0, function () {
        var allScriptElems, thisScriptElem, entryPointDll, entryPointMethod, entryPointAssemblyName, referenceAssembliesCommaSeparated, referenceAssemblies, loadAssemblyUrls, ex_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    allScriptElems = document.getElementsByTagName('script');
                    thisScriptElem = (document.currentScript || allScriptElems[allScriptElems.length - 1]);
                    entryPointDll = getRequiredBootScriptAttribute(thisScriptElem, 'main');
                    entryPointMethod = getRequiredBootScriptAttribute(thisScriptElem, 'entrypoint');
                    entryPointAssemblyName = DotNet_1.getAssemblyNameFromUrl(entryPointDll);
                    referenceAssembliesCommaSeparated = thisScriptElem.getAttribute('references') || '';
                    referenceAssemblies = referenceAssembliesCommaSeparated
                        .split(',')
                        .map(function (s) { return s.trim(); })
                        .filter(function (s) { return !!s; });
                    loadAssemblyUrls = [entryPointDll]
                        .concat(referenceAssemblies)
                        .map(function (filename) { return "_framework/_bin/" + filename; });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, Environment_1.platform.start(loadAssemblyUrls)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    ex_1 = _a.sent();
                    throw new Error("Failed to start platform. Reason: " + ex_1);
                case 4:
                    // Start up the application
                    Environment_1.platform.callEntryPoint(entryPointAssemblyName, entryPointMethod, []);
                    return [2 /*return*/];
            }
        });
    });
}
function getRequiredBootScriptAttribute(elem, attributeName) {
    var result = elem.getAttribute(attributeName);
    if (!result) {
        throw new Error("Missing \"" + attributeName + "\" attribute on Blazor script tag.");
    }
    return result;
}
boot();


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var DotNet_1 = __webpack_require__(2);
var RegisteredFunction_1 = __webpack_require__(1);
var assembly_load;
var find_class;
var find_method;
var invoke_method;
var mono_string_get_utf8;
var mono_string;
exports.monoPlatform = {
    start: function start(loadAssemblyUrls) {
        return new Promise(function (resolve, reject) {
            // mono.js assumes the existence of this
            window['Browser'] = {
                init: function () { },
                asyncLoad: asyncLoad
            };
            // Emscripten works by expecting the module config to be a global
            window['Module'] = createEmscriptenModuleInstance(loadAssemblyUrls, resolve, reject);
            addScriptTagsToDocument();
        });
    },
    findMethod: function findMethod(assemblyName, namespace, className, methodName) {
        // TODO: Cache the assembly_load outputs?
        var assemblyHandle = assembly_load(assemblyName);
        if (!assemblyHandle) {
            throw new Error("Could not find assembly \"" + assemblyName + "\"");
        }
        var typeHandle = find_class(assemblyHandle, namespace, className);
        if (!typeHandle) {
            throw new Error("Could not find type \"" + className + "\" in namespace \"" + namespace + "\" in assembly \"" + assemblyName + "\"");
        }
        var methodHandle = find_method(typeHandle, methodName, -1);
        if (!methodHandle) {
            throw new Error("Could not find method \"" + methodName + "\" on type \"" + namespace + "." + className + "\"");
        }
        return methodHandle;
    },
    callEntryPoint: function callEntryPoint(assemblyName, entrypointMethod, args) {
        // Parse the entrypointMethod, which is of the form MyApp.MyNamespace.MyTypeName::MyMethodName
        // Note that we don't support specifying a method overload, so it has to be unique
        var entrypointSegments = entrypointMethod.split('::');
        if (entrypointSegments.length != 2) {
            throw new Error('Malformed entry point method name; could not resolve class name and method name.');
        }
        var typeFullName = entrypointSegments[0];
        var methodName = entrypointSegments[1];
        var lastDot = typeFullName.lastIndexOf('.');
        var namespace = lastDot > -1 ? typeFullName.substring(0, lastDot) : '';
        var typeShortName = lastDot > -1 ? typeFullName.substring(lastDot + 1) : typeFullName;
        var entryPointMethodHandle = exports.monoPlatform.findMethod(assemblyName, namespace, typeShortName, methodName);
        exports.monoPlatform.callMethod(entryPointMethodHandle, null, args);
    },
    callMethod: function callMethod(method, target, args) {
        if (args.length > 4) {
            // Hopefully this restriction can be eased soon, but for now make it clear what's going on
            throw new Error("Currently, MonoPlatform supports passing a maximum of 4 arguments from JS to .NET. You tried to pass " + args.length + ".");
        }
        var stack = Module.stackSave();
        try {
            var argsBuffer = Module.stackAlloc(args.length);
            var exceptionFlagManagedInt = Module.stackAlloc(4);
            for (var i = 0; i < args.length; ++i) {
                Module.setValue(argsBuffer + i * 4, args[i], 'i32');
            }
            Module.setValue(exceptionFlagManagedInt, 0, 'i32');
            var res = invoke_method(method, target, argsBuffer, exceptionFlagManagedInt);
            if (Module.getValue(exceptionFlagManagedInt, 'i32') !== 0) {
                // If the exception flag is set, the returned value is exception.ToString()
                throw new Error(exports.monoPlatform.toJavaScriptString(res));
            }
            return res;
        }
        finally {
            Module.stackRestore(stack);
        }
    },
    toJavaScriptString: function toJavaScriptString(managedString) {
        // Comments from original Mono sample:
        //FIXME this is wastefull, we could remove the temp malloc by going the UTF16 route
        //FIXME this is unsafe, cuz raw objects could be GC'd.
        var utf8 = mono_string_get_utf8(managedString);
        var res = Module.UTF8ToString(utf8);
        Module._free(utf8);
        return res;
    },
    toDotNetString: function toDotNetString(jsString) {
        return mono_string(jsString);
    },
    getArrayLength: function getArrayLength(array) {
        return Module.getValue(getArrayDataPointer(array), 'i32');
    },
    getArrayEntryPtr: function getArrayEntryPtr(array, index, itemSize) {
        // First byte is array length, followed by entries
        var address = getArrayDataPointer(array) + 4 + index * itemSize;
        return address;
    },
    getObjectFieldsBaseAddress: function getObjectFieldsBaseAddress(referenceTypedObject) {
        // The first two int32 values are internal Mono data
        return (referenceTypedObject + 8);
    },
    readInt32Field: function readHeapInt32(baseAddress, fieldOffset) {
        return Module.getValue(baseAddress + (fieldOffset || 0), 'i32');
    },
    readObjectField: function readHeapObject(baseAddress, fieldOffset) {
        return Module.getValue(baseAddress + (fieldOffset || 0), 'i32');
    },
    readStringField: function readHeapObject(baseAddress, fieldOffset) {
        var fieldValue = Module.getValue(baseAddress + (fieldOffset || 0), 'i32');
        return fieldValue === 0 ? null : exports.monoPlatform.toJavaScriptString(fieldValue);
    },
    readStructField: function readStructField(baseAddress, fieldOffset) {
        return (baseAddress + (fieldOffset || 0));
    },
};
// Bypass normal type checking to add this extra function. It's only intended to be called from
// the JS code in Mono's driver.c. It's never intended to be called from TypeScript.
exports.monoPlatform.monoGetRegisteredFunction = RegisteredFunction_1.getRegisteredFunction;
function addScriptTagsToDocument() {
    // Load either the wasm or asm.js version of the Mono runtime
    var browserSupportsNativeWebAssembly = typeof WebAssembly !== 'undefined' && WebAssembly.validate;
    var monoRuntimeUrlBase = '_framework/' + (browserSupportsNativeWebAssembly ? 'wasm' : 'asmjs');
    var monoRuntimeScriptUrl = monoRuntimeUrlBase + "/mono.js";
    if (!browserSupportsNativeWebAssembly) {
        // In the asmjs case, the initial memory structure is in a separate file we need to download
        var meminitXHR = Module['memoryInitializerRequest'] = new XMLHttpRequest();
        meminitXHR.open('GET', monoRuntimeUrlBase + "/mono.js.mem");
        meminitXHR.responseType = 'arraybuffer';
        meminitXHR.send(null);
    }
    document.write("<script defer src=\"" + monoRuntimeScriptUrl + "\"></script>");
}
function createEmscriptenModuleInstance(loadAssemblyUrls, onReady, onError) {
    var module = {};
    var wasmBinaryFile = '_framework/wasm/mono.wasm';
    var asmjsCodeFile = '_framework/asmjs/mono.asm.js';
    module.print = function (line) { return console.log("WASM: " + line); };
    module.printErr = function (line) { return console.error("WASM: " + line); };
    module.preRun = [];
    module.postRun = [];
    module.preloadPlugins = [];
    module.locateFile = function (fileName) {
        switch (fileName) {
            case 'mono.wasm': return wasmBinaryFile;
            case 'mono.asm.js': return asmjsCodeFile;
            default: return fileName;
        }
    };
    module.preRun.push(function () {
        // By now, emscripten should be initialised enough that we can capture these methods for later use
        assembly_load = Module.cwrap('mono_wasm_assembly_load', 'number', ['string']);
        find_class = Module.cwrap('mono_wasm_assembly_find_class', 'number', ['number', 'string', 'string']);
        find_method = Module.cwrap('mono_wasm_assembly_find_method', 'number', ['number', 'string', 'number']);
        invoke_method = Module.cwrap('mono_wasm_invoke_method', 'number', ['number', 'number', 'number']);
        mono_string_get_utf8 = Module.cwrap('mono_wasm_string_get_utf8', 'number', ['number']);
        mono_string = Module.cwrap('mono_wasm_string_from_js', 'number', ['string']);
        Module.FS_createPath('/', 'appBinDir', true, true);
        loadAssemblyUrls.forEach(function (url) {
            return FS.createPreloadedFile('appBinDir', DotNet_1.getAssemblyNameFromUrl(url) + ".dll", url, true, false, undefined, onError);
        });
    });
    module.postRun.push(function () {
        var load_runtime = Module.cwrap('mono_wasm_load_runtime', null, ['string']);
        load_runtime('appBinDir');
        onReady();
    });
    return module;
}
function asyncLoad(url, onload, onerror) {
    var xhr = new XMLHttpRequest;
    xhr.open('GET', url, /* async: */ true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function xhr_onload() {
        if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
            var asm = new Uint8Array(xhr.response);
            onload(asm);
        }
        else {
            onerror(xhr);
        }
    };
    xhr.onerror = onerror;
    xhr.send(null);
}
function getArrayDataPointer(array) {
    return array + 12; // First byte from here is length, then following bytes are entries
}


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var InvokeWithJsonMarshalling_1 = __webpack_require__(7);
var Renderer_1 = __webpack_require__(3);
/**
 * The definitive list of internal functions invokable from .NET code.
 * These function names are treated as 'reserved' and cannot be passed to registerFunction.
 */
exports.internalRegisteredFunctions = {
    attachComponentToElement: Renderer_1.attachComponentToElement,
    invokeWithJsonMarshalling: InvokeWithJsonMarshalling_1.invokeWithJsonMarshalling,
    renderBatch: Renderer_1.renderBatch,
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Environment_1 = __webpack_require__(0);
var RegisteredFunction_1 = __webpack_require__(1);
function invokeWithJsonMarshalling(identifier) {
    var argsJson = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        argsJson[_i - 1] = arguments[_i];
    }
    var identifierJsString = Environment_1.platform.toJavaScriptString(identifier);
    var funcInstance = RegisteredFunction_1.getRegisteredFunction(identifierJsString);
    var args = argsJson.map(function (json) { return JSON.parse(Environment_1.platform.toJavaScriptString(json)); });
    var result = funcInstance.apply(null, args);
    if (result !== null && result !== undefined) {
        var resultJson = JSON.stringify(result);
        return Environment_1.platform.toDotNetString(resultJson);
    }
    else {
        return null;
    }
}
exports.invokeWithJsonMarshalling = invokeWithJsonMarshalling;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Environment_1 = __webpack_require__(0);
// Keep in sync with the structs in .NET code
exports.renderBatch = {
    updatedComponents: function (obj) { return Environment_1.platform.readStructField(obj, 0); },
    referenceFrames: function (obj) { return Environment_1.platform.readStructField(obj, arrayRangeStructLength); },
    disposedComponentIds: function (obj) { return Environment_1.platform.readStructField(obj, arrayRangeStructLength + arrayRangeStructLength); },
};
var arrayRangeStructLength = 8;
exports.arrayRange = {
    array: function (obj) { return Environment_1.platform.readObjectField(obj, 0); },
    count: function (obj) { return Environment_1.platform.readInt32Field(obj, 4); },
};
var arraySegmentStructLength = 12;
exports.arraySegment = {
    array: function (obj) { return Environment_1.platform.readObjectField(obj, 0); },
    offset: function (obj) { return Environment_1.platform.readInt32Field(obj, 4); },
    count: function (obj) { return Environment_1.platform.readInt32Field(obj, 8); },
};
exports.renderTreeDiffStructLength = 4 + arraySegmentStructLength;
exports.renderTreeDiff = {
    componentId: function (obj) { return Environment_1.platform.readInt32Field(obj, 0); },
    edits: function (obj) { return Environment_1.platform.readStructField(obj, 4); },
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var RenderTreeEdit_1 = __webpack_require__(10);
var RenderTreeFrame_1 = __webpack_require__(11);
var Environment_1 = __webpack_require__(0);
var raiseEventMethod;
var renderComponentMethod;
var BrowserRenderer = /** @class */ (function () {
    function BrowserRenderer(browserRendererId) {
        this.browserRendererId = browserRendererId;
        this.childComponentLocations = {};
    }
    BrowserRenderer.prototype.attachComponentToElement = function (componentId, element) {
        this.childComponentLocations[componentId] = element;
    };
    BrowserRenderer.prototype.updateComponent = function (componentId, edits, editsOffset, editsLength, referenceFrames) {
        var element = this.childComponentLocations[componentId];
        if (!element) {
            throw new Error("No element is currently associated with component " + componentId);
        }
        this.applyEdits(componentId, element, 0, edits, editsOffset, editsLength, referenceFrames);
    };
    BrowserRenderer.prototype.disposeComponent = function (componentId) {
        delete this.childComponentLocations[componentId];
    };
    BrowserRenderer.prototype.applyEdits = function (componentId, parent, childIndex, edits, editsOffset, editsLength, referenceFrames) {
        var currentDepth = 0;
        var childIndexAtCurrentDepth = childIndex;
        var maxEditIndexExcl = editsOffset + editsLength;
        for (var editIndex = editsOffset; editIndex < maxEditIndexExcl; editIndex++) {
            var edit = RenderTreeEdit_1.getRenderTreeEditPtr(edits, editIndex);
            var editType = RenderTreeEdit_1.renderTreeEdit.type(edit);
            switch (editType) {
                case RenderTreeEdit_1.EditType.prependFrame: {
                    var frameIndex = RenderTreeEdit_1.renderTreeEdit.newTreeIndex(edit);
                    var frame = RenderTreeFrame_1.getTreeFramePtr(referenceFrames, frameIndex);
                    var siblingIndex = RenderTreeEdit_1.renderTreeEdit.siblingIndex(edit);
                    this.insertFrame(componentId, parent, childIndexAtCurrentDepth + siblingIndex, referenceFrames, frame, frameIndex);
                    break;
                }
                case RenderTreeEdit_1.EditType.removeFrame: {
                    var siblingIndex = RenderTreeEdit_1.renderTreeEdit.siblingIndex(edit);
                    removeNodeFromDOM(parent, childIndexAtCurrentDepth + siblingIndex);
                    break;
                }
                case RenderTreeEdit_1.EditType.setAttribute: {
                    var frameIndex = RenderTreeEdit_1.renderTreeEdit.newTreeIndex(edit);
                    var frame = RenderTreeFrame_1.getTreeFramePtr(referenceFrames, frameIndex);
                    var siblingIndex = RenderTreeEdit_1.renderTreeEdit.siblingIndex(edit);
                    var element = parent.childNodes[childIndexAtCurrentDepth + siblingIndex];
                    this.applyAttribute(componentId, element, frame);
                    break;
                }
                case RenderTreeEdit_1.EditType.removeAttribute: {
                    var siblingIndex = RenderTreeEdit_1.renderTreeEdit.siblingIndex(edit);
                    removeAttributeFromDOM(parent, childIndexAtCurrentDepth + siblingIndex, RenderTreeEdit_1.renderTreeEdit.removedAttributeName(edit));
                    break;
                }
                case RenderTreeEdit_1.EditType.updateText: {
                    var frameIndex = RenderTreeEdit_1.renderTreeEdit.newTreeIndex(edit);
                    var frame = RenderTreeFrame_1.getTreeFramePtr(referenceFrames, frameIndex);
                    var siblingIndex = RenderTreeEdit_1.renderTreeEdit.siblingIndex(edit);
                    var domTextNode = parent.childNodes[childIndexAtCurrentDepth + siblingIndex];
                    domTextNode.textContent = RenderTreeFrame_1.renderTreeFrame.textContent(frame);
                    break;
                }
                case RenderTreeEdit_1.EditType.stepIn: {
                    var siblingIndex = RenderTreeEdit_1.renderTreeEdit.siblingIndex(edit);
                    parent = parent.childNodes[childIndexAtCurrentDepth + siblingIndex];
                    currentDepth++;
                    childIndexAtCurrentDepth = 0;
                    break;
                }
                case RenderTreeEdit_1.EditType.stepOut: {
                    parent = parent.parentElement;
                    currentDepth--;
                    childIndexAtCurrentDepth = currentDepth === 0 ? childIndex : 0; // The childIndex is only ever nonzero at zero depth
                    break;
                }
                default: {
                    var unknownType = editType; // Compile-time verification that the switch was exhaustive
                    throw new Error("Unknown edit type: " + unknownType);
                }
            }
        }
    };
    BrowserRenderer.prototype.insertFrame = function (componentId, parent, childIndex, frames, frame, frameIndex) {
        var frameType = RenderTreeFrame_1.renderTreeFrame.frameType(frame);
        switch (frameType) {
            case RenderTreeFrame_1.FrameType.element:
                this.insertElement(componentId, parent, childIndex, frames, frame, frameIndex);
                return 1;
            case RenderTreeFrame_1.FrameType.text:
                this.insertText(parent, childIndex, frame);
                return 1;
            case RenderTreeFrame_1.FrameType.attribute:
                throw new Error('Attribute frames should only be present as leading children of element frames.');
            case RenderTreeFrame_1.FrameType.component:
                this.insertComponent(parent, childIndex, frame);
                return 1;
            case RenderTreeFrame_1.FrameType.region:
                return this.insertFrameRange(componentId, parent, childIndex, frames, frameIndex + 1, frameIndex + RenderTreeFrame_1.renderTreeFrame.subtreeLength(frame));
            default:
                var unknownType = frameType; // Compile-time verification that the switch was exhaustive
                throw new Error("Unknown frame type: " + unknownType);
        }
    };
    BrowserRenderer.prototype.insertElement = function (componentId, parent, childIndex, frames, frame, frameIndex) {
        var tagName = RenderTreeFrame_1.renderTreeFrame.elementName(frame);
        var newDomElement = document.createElement(tagName);
        insertNodeIntoDOM(newDomElement, parent, childIndex);
        // Apply attributes
        var descendantsEndIndexExcl = frameIndex + RenderTreeFrame_1.renderTreeFrame.subtreeLength(frame);
        for (var descendantIndex = frameIndex + 1; descendantIndex < descendantsEndIndexExcl; descendantIndex++) {
            var descendantFrame = RenderTreeFrame_1.getTreeFramePtr(frames, descendantIndex);
            if (RenderTreeFrame_1.renderTreeFrame.frameType(descendantFrame) === RenderTreeFrame_1.FrameType.attribute) {
                this.applyAttribute(componentId, newDomElement, descendantFrame);
            }
            else {
                // As soon as we see a non-attribute child, all the subsequent child frames are
                // not attributes, so bail out and insert the remnants recursively
                this.insertFrameRange(componentId, newDomElement, 0, frames, descendantIndex, descendantsEndIndexExcl);
                break;
            }
        }
    };
    BrowserRenderer.prototype.insertComponent = function (parent, childIndex, frame) {
        // Currently, to support O(1) lookups from render tree frames to DOM nodes, we rely on
        // each child component existing as a single top-level element in the DOM. To guarantee
        // that, we wrap child components in these 'blazor-component' wrappers.
        // To improve on this in the future:
        // - If we can statically detect that a given component always produces a single top-level
        //   element anyway, then don't wrap it in a further nonstandard element
        // - If we really want to support child components producing multiple top-level frames and
        //   not being wrapped in a container at all, then every time a component is refreshed in
        //   the DOM, we could update an array on the parent element that specifies how many DOM
        //   nodes correspond to each of its render tree frames. Then when that parent wants to
        //   locate the first DOM node for a render tree frame, it can sum all the frame counts for
        //   all the preceding render trees frames. It's O(N), but where N is the number of siblings
        //   (counting child components as a single item), so N will rarely if ever be large.
        //   We could even keep track of whether all the child components happen to have exactly 1
        //   top level frames, and in that case, there's no need to sum as we can do direct lookups.
        var containerElement = document.createElement('blazor-component');
        insertNodeIntoDOM(containerElement, parent, childIndex);
        // All we have to do is associate the child component ID with its location. We don't actually
        // do any rendering here, because the diff for the child will appear later in the render batch.
        var childComponentId = RenderTreeFrame_1.renderTreeFrame.componentId(frame);
        this.attachComponentToElement(childComponentId, containerElement);
    };
    BrowserRenderer.prototype.insertText = function (parent, childIndex, textFrame) {
        var textContent = RenderTreeFrame_1.renderTreeFrame.textContent(textFrame);
        var newDomTextNode = document.createTextNode(textContent);
        insertNodeIntoDOM(newDomTextNode, parent, childIndex);
    };
    BrowserRenderer.prototype.applyAttribute = function (componentId, toDomElement, attributeFrame) {
        var attributeName = RenderTreeFrame_1.renderTreeFrame.attributeName(attributeFrame);
        var browserRendererId = this.browserRendererId;
        var eventHandlerId = RenderTreeFrame_1.renderTreeFrame.attributeEventHandlerId(attributeFrame);
        if (attributeName === 'value') {
            if (this.tryApplyValueProperty(toDomElement, RenderTreeFrame_1.renderTreeFrame.attributeValue(attributeFrame))) {
                return; // If this DOM element type has special 'value' handling, don't also write it as an attribute
            }
        }
        // TODO: Instead of applying separate event listeners to each DOM element, use event delegation
        // and remove all the _blazor*Listener hacks
        switch (attributeName) {
            case 'onclick': {
                toDomElement.removeEventListener('click', toDomElement['_blazorClickListener']);
                var listener = function (evt) { return raiseEvent(evt, browserRendererId, componentId, eventHandlerId, 'mouse', { Type: 'click' }); };
                toDomElement['_blazorClickListener'] = listener;
                toDomElement.addEventListener('click', listener);
                break;
            }
            case 'onchange': {
                toDomElement.removeEventListener('change', toDomElement['_blazorChangeListener']);
                var targetIsCheckbox_1 = isCheckbox(toDomElement);
                var listener = function (evt) {
                    var newValue = targetIsCheckbox_1 ? evt.target.checked : evt.target.value;
                    raiseEvent(evt, browserRendererId, componentId, eventHandlerId, 'change', { Type: 'change', Value: newValue });
                };
                toDomElement['_blazorChangeListener'] = listener;
                toDomElement.addEventListener('change', listener);
                break;
            }
            case 'onkeypress': {
                toDomElement.removeEventListener('keypress', toDomElement['_blazorKeypressListener']);
                var listener = function (evt) {
                    // This does not account for special keys nor cross-browser differences. So far it's
                    // just to establish that we can pass parameters when raising events.
                    // We use C#-style PascalCase on the eventInfo to simplify deserialization, but this could
                    // change if we introduced a richer JSON library on the .NET side.
                    raiseEvent(evt, browserRendererId, componentId, eventHandlerId, 'keyboard', { Type: evt.type, Key: evt.key });
                };
                toDomElement['_blazorKeypressListener'] = listener;
                toDomElement.addEventListener('keypress', listener);
                break;
            }
            default:
                // Treat as a regular string-valued attribute
                toDomElement.setAttribute(attributeName, RenderTreeFrame_1.renderTreeFrame.attributeValue(attributeFrame));
                break;
        }
    };
    BrowserRenderer.prototype.tryApplyValueProperty = function (element, value) {
        // Certain elements have built-in behaviour for their 'value' property
        switch (element.tagName) {
            case 'INPUT':
            case 'SELECT':
                if (isCheckbox(element)) {
                    element.checked = value === 'True';
                }
                else {
                    // Note: this doen't handle <select> correctly: https://github.com/aspnet/Blazor/issues/157
                    element.value = value;
                }
                return true;
            default:
                return false;
        }
    };
    BrowserRenderer.prototype.insertFrameRange = function (componentId, parent, childIndex, frames, startIndex, endIndexExcl) {
        var origChildIndex = childIndex;
        for (var index = startIndex; index < endIndexExcl; index++) {
            var frame = RenderTreeFrame_1.getTreeFramePtr(frames, index);
            var numChildrenInserted = this.insertFrame(componentId, parent, childIndex, frames, frame, index);
            childIndex += numChildrenInserted;
            // Skip over any descendants, since they are already dealt with recursively
            var subtreeLength = RenderTreeFrame_1.renderTreeFrame.subtreeLength(frame);
            if (subtreeLength > 1) {
                index += subtreeLength - 1;
            }
        }
        return (childIndex - origChildIndex); // Total number of children inserted
    };
    return BrowserRenderer;
}());
exports.BrowserRenderer = BrowserRenderer;
function isCheckbox(element) {
    return element.tagName === 'INPUT' && element.getAttribute('type') === 'checkbox';
}
function insertNodeIntoDOM(node, parent, childIndex) {
    if (childIndex >= parent.childNodes.length) {
        parent.appendChild(node);
    }
    else {
        parent.insertBefore(node, parent.childNodes[childIndex]);
    }
}
function removeNodeFromDOM(parent, childIndex) {
    parent.removeChild(parent.childNodes[childIndex]);
}
function removeAttributeFromDOM(parent, childIndex, attributeName) {
    var element = parent.childNodes[childIndex];
    element.removeAttribute(attributeName);
}
function raiseEvent(event, browserRendererId, componentId, eventHandlerId, eventInfoType, eventInfo) {
    event.preventDefault();
    if (!raiseEventMethod) {
        raiseEventMethod = Environment_1.platform.findMethod('Microsoft.AspNetCore.Blazor.Browser', 'Microsoft.AspNetCore.Blazor.Browser.Rendering', 'BrowserRendererEventDispatcher', 'DispatchEvent');
    }
    var eventDescriptor = {
        BrowserRendererId: browserRendererId,
        ComponentId: componentId,
        EventHandlerId: eventHandlerId,
        EventArgsType: eventInfoType
    };
    Environment_1.platform.callMethod(raiseEventMethod, null, [
        Environment_1.platform.toDotNetString(JSON.stringify(eventDescriptor)),
        Environment_1.platform.toDotNetString(JSON.stringify(eventInfo))
    ]);
}


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Environment_1 = __webpack_require__(0);
var renderTreeEditStructLength = 16;
function getRenderTreeEditPtr(renderTreeEdits, index) {
    return Environment_1.platform.getArrayEntryPtr(renderTreeEdits, index, renderTreeEditStructLength);
}
exports.getRenderTreeEditPtr = getRenderTreeEditPtr;
exports.renderTreeEdit = {
    // The properties and memory layout must be kept in sync with the .NET equivalent in RenderTreeEdit.cs
    type: function (edit) { return Environment_1.platform.readInt32Field(edit, 0); },
    siblingIndex: function (edit) { return Environment_1.platform.readInt32Field(edit, 4); },
    newTreeIndex: function (edit) { return Environment_1.platform.readInt32Field(edit, 8); },
    removedAttributeName: function (edit) { return Environment_1.platform.readStringField(edit, 12); },
};
var EditType;
(function (EditType) {
    EditType[EditType["prependFrame"] = 1] = "prependFrame";
    EditType[EditType["removeFrame"] = 2] = "removeFrame";
    EditType[EditType["setAttribute"] = 3] = "setAttribute";
    EditType[EditType["removeAttribute"] = 4] = "removeAttribute";
    EditType[EditType["updateText"] = 5] = "updateText";
    EditType[EditType["stepIn"] = 6] = "stepIn";
    EditType[EditType["stepOut"] = 7] = "stepOut";
})(EditType = exports.EditType || (exports.EditType = {}));


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Environment_1 = __webpack_require__(0);
var renderTreeFrameStructLength = 28;
// To minimise GC pressure, instead of instantiating a JS object to represent each tree frame,
// we work in terms of pointers to the structs on the .NET heap, and use static functions that
// know how to read property values from those structs.
function getTreeFramePtr(renderTreeEntries, index) {
    return Environment_1.platform.getArrayEntryPtr(renderTreeEntries, index, renderTreeFrameStructLength);
}
exports.getTreeFramePtr = getTreeFramePtr;
exports.renderTreeFrame = {
    // The properties and memory layout must be kept in sync with the .NET equivalent in RenderTreeFrame.cs
    frameType: function (frame) { return Environment_1.platform.readInt32Field(frame, 4); },
    subtreeLength: function (frame) { return Environment_1.platform.readInt32Field(frame, 8); },
    componentId: function (frame) { return Environment_1.platform.readInt32Field(frame, 12); },
    elementName: function (frame) { return Environment_1.platform.readStringField(frame, 16); },
    textContent: function (frame) { return Environment_1.platform.readStringField(frame, 16); },
    attributeName: function (frame) { return Environment_1.platform.readStringField(frame, 16); },
    attributeValue: function (frame) { return Environment_1.platform.readStringField(frame, 24); },
    attributeEventHandlerId: function (frame) { return Environment_1.platform.readInt32Field(frame, 8); },
};
var FrameType;
(function (FrameType) {
    // The values must be kept in sync with the .NET equivalent in RenderTreeFrameType.cs
    FrameType[FrameType["element"] = 1] = "element";
    FrameType[FrameType["text"] = 2] = "text";
    FrameType[FrameType["attribute"] = 3] = "attribute";
    FrameType[FrameType["component"] = 4] = "component";
    FrameType[FrameType["region"] = 5] = "region";
})(FrameType = exports.FrameType || (exports.FrameType = {}));


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var RegisteredFunction_1 = __webpack_require__(1);
var Environment_1 = __webpack_require__(0);
var httpClientAssembly = 'Microsoft.AspNetCore.Blazor.Browser';
var httpClientNamespace = httpClientAssembly + ".Http";
var httpClientTypeName = 'BrowserHttpMessageHandler';
var httpClientFullTypeName = httpClientNamespace + "." + httpClientTypeName;
var receiveResponseMethod;
RegisteredFunction_1.registerFunction(httpClientFullTypeName + ".Send", function (id, method, requestUri, body, headersJson) {
    sendAsync(id, method, requestUri, body, headersJson);
});
function sendAsync(id, method, requestUri, body, headersJson) {
    return __awaiter(this, void 0, void 0, function () {
        var response, responseText, ex_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch(requestUri, {
                            method: method,
                            body: body || undefined,
                            headers: headersJson ? JSON.parse(headersJson) : undefined
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.text()];
                case 2:
                    responseText = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    ex_1 = _a.sent();
                    dispatchErrorResponse(id, ex_1.toString());
                    return [2 /*return*/];
                case 4:
                    dispatchSuccessResponse(id, response, responseText);
                    return [2 /*return*/];
            }
        });
    });
}
function dispatchSuccessResponse(id, response, responseText) {
    var responseDescriptor = {
        StatusCode: response.status,
        Headers: []
    };
    response.headers.forEach(function (value, name) {
        responseDescriptor.Headers.push([name, value]);
    });
    dispatchResponse(id, Environment_1.platform.toDotNetString(JSON.stringify(responseDescriptor)), Environment_1.platform.toDotNetString(responseText), // TODO: Consider how to handle non-string responses
    /* errorMessage */ null);
}
function dispatchErrorResponse(id, errorMessage) {
    dispatchResponse(id, 
    /* responseDescriptor */ null, 
    /* responseText */ null, Environment_1.platform.toDotNetString(errorMessage));
}
function dispatchResponse(id, responseDescriptor, responseText, errorMessage) {
    if (!receiveResponseMethod) {
        receiveResponseMethod = Environment_1.platform.findMethod(httpClientAssembly, httpClientNamespace, httpClientTypeName, 'ReceiveResponse');
    }
    Environment_1.platform.callMethod(receiveResponseMethod, null, [
        Environment_1.platform.toDotNetString(id.toString()),
        responseDescriptor,
        responseText,
        errorMessage,
    ]);
}


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var RegisteredFunction_1 = __webpack_require__(1);
var Environment_1 = __webpack_require__(0);
var registeredFunctionPrefix = 'Microsoft.AspNetCore.Blazor.Browser.Services.BrowserUriHelper';
var notifyLocationChangedMethod;
var hasRegisteredEventListeners = false;
RegisteredFunction_1.registerFunction(registeredFunctionPrefix + ".getLocationHref", function () { return Environment_1.platform.toDotNetString(location.href); });
RegisteredFunction_1.registerFunction(registeredFunctionPrefix + ".getBaseURI", function () { return document.baseURI ? Environment_1.platform.toDotNetString(document.baseURI) : null; });
RegisteredFunction_1.registerFunction(registeredFunctionPrefix + ".enableNavigationInteception", function () {
    if (hasRegisteredEventListeners) {
        return;
    }
    hasRegisteredEventListeners = true;
    document.addEventListener('click', function (event) {
        // Intercept clicks on all <a> elements where the href is within the <base href> URI space
        var anchorTarget = findClosestAncestor(event.target, 'A');
        if (anchorTarget) {
            var href = anchorTarget.getAttribute('href');
            if (isWithinBaseUriSpace(toAbsoluteUri(href))) {
                event.preventDefault();
                history.pushState(null, /* ignored title */ '', href);
                handleInternalNavigation();
            }
        }
    });
    window.addEventListener('popstate', handleInternalNavigation);
});
function handleInternalNavigation() {
    if (!notifyLocationChangedMethod) {
        notifyLocationChangedMethod = Environment_1.platform.findMethod('Microsoft.AspNetCore.Blazor.Browser', 'Microsoft.AspNetCore.Blazor.Browser.Services', 'BrowserUriHelper', 'NotifyLocationChanged');
    }
    Environment_1.platform.callMethod(notifyLocationChangedMethod, null, [
        Environment_1.platform.toDotNetString(location.href)
    ]);
}
var testAnchor;
function toAbsoluteUri(relativeUri) {
    testAnchor = testAnchor || document.createElement('a');
    testAnchor.href = relativeUri;
    return testAnchor.href;
}
function findClosestAncestor(element, tagName) {
    return !element
        ? null
        : element.tagName === tagName
            ? element
            : findClosestAncestor(element.parentElement, tagName);
}
function isWithinBaseUriSpace(href) {
    var baseUriPrefixWithTrailingSlash = toBaseUriPrefixWithTrailingSlash(document.baseURI); // TODO: Might baseURI really be null?
    return href.startsWith(baseUriPrefixWithTrailingSlash);
}
function toBaseUriPrefixWithTrailingSlash(baseUri) {
    return baseUri.substr(0, baseUri.lastIndexOf('/') + 1);
}


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Environment_1 = __webpack_require__(0);
var RegisteredFunction_1 = __webpack_require__(1);
if (typeof window !== 'undefined') {
    // When the library is loaded in a browser via a <script> element, make the
    // following APIs available in global scope for invocation from JS
    window['Blazor'] = {
        platform: Environment_1.platform,
        registerFunction: RegisteredFunction_1.registerFunction,
    };
}


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZTg3ZTI1ZDVlNDdlNDQxMTFkZjIiLCJ3ZWJwYWNrOi8vLy4vc3JjL0Vudmlyb25tZW50LnRzIiwid2VicGFjazovLy8uL3NyYy9JbnRlcm9wL1JlZ2lzdGVyZWRGdW5jdGlvbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvUGxhdGZvcm0vRG90TmV0LnRzIiwid2VicGFjazovLy8uL3NyYy9SZW5kZXJpbmcvUmVuZGVyZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0Jvb3QudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1BsYXRmb3JtL01vbm8vTW9ub1BsYXRmb3JtLnRzIiwid2VicGFjazovLy8uL3NyYy9JbnRlcm9wL0ludGVybmFsUmVnaXN0ZXJlZEZ1bmN0aW9uLnRzIiwid2VicGFjazovLy8uL3NyYy9JbnRlcm9wL0ludm9rZVdpdGhKc29uTWFyc2hhbGxpbmcudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1JlbmRlcmluZy9SZW5kZXJCYXRjaC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvUmVuZGVyaW5nL0Jyb3dzZXJSZW5kZXJlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvUmVuZGVyaW5nL1JlbmRlclRyZWVFZGl0LnRzIiwid2VicGFjazovLy8uL3NyYy9SZW5kZXJpbmcvUmVuZGVyVHJlZUZyYW1lLnRzIiwid2VicGFjazovLy8uL3NyYy9TZXJ2aWNlcy9IdHRwLnRzIiwid2VicGFjazovLy8uL3NyYy9TZXJ2aWNlcy9VcmlIZWxwZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0dsb2JhbEV4cG9ydHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNB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LE9BQU8sQ0FBQztBQUMzRCxDQUFDO0FBRUQsOEJBQThCLElBQVk7SUFDeEMsSUFBTSw4QkFBOEIsR0FBRyxnQ0FBZ0MsQ0FBQyxRQUFRLENBQUMsT0FBUSxDQUFDLENBQUMsQ0FBQyxzQ0FBc0M7SUFDbEksTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsOEJBQThCLENBQUMsQ0FBQztBQUN6RCxDQUFDO0FBRUQsMENBQTBDLE9BQWU7SUFDdkQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDekQsQ0FBQzs7Ozs7Ozs7OztBQ3hFRCwyQ0FBd0M7QUFDeEMsa0RBQWdFO0FBRWhFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sTUFBTSxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUM7SUFDbEMsMkVBQTJFO0lBQzNFLGtFQUFrRTtJQUNsRSxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUc7UUFDakIsUUFBUTtRQUNSLGdCQUFnQjtLQUNqQixDQUFDO0FBQ0osQ0FBQyIsImZpbGUiOiJibGF6b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA0KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBlODdlMjVkNWU0N2U0NDExMWRmMiIsIi8vIEV4cG9zZSBhbiBleHBvcnQgY2FsbGVkICdwbGF0Zm9ybScgb2YgdGhlIGludGVyZmFjZSB0eXBlICdQbGF0Zm9ybScsXG4vLyBzbyB0aGF0IGNvbnN1bWVycyBjYW4gYmUgYWdub3N0aWMgYWJvdXQgd2hpY2ggaW1wbGVtZW50YXRpb24gdGhleSB1c2UuXG4vLyBCYXNpYyBhbHRlcm5hdGl2ZSB0byBoYXZpbmcgYW4gYWN0dWFsIERJIGNvbnRhaW5lci5cbmltcG9ydCB7IFBsYXRmb3JtIH0gZnJvbSAnLi9QbGF0Zm9ybS9QbGF0Zm9ybSc7XG5pbXBvcnQgeyBtb25vUGxhdGZvcm0gfSBmcm9tICcuL1BsYXRmb3JtL01vbm8vTW9ub1BsYXRmb3JtJztcbmV4cG9ydCBjb25zdCBwbGF0Zm9ybTogUGxhdGZvcm0gPSBtb25vUGxhdGZvcm07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvRW52aXJvbm1lbnQudHMiLCJpbXBvcnQgeyBpbnRlcm5hbFJlZ2lzdGVyZWRGdW5jdGlvbnMgfSBmcm9tICcuL0ludGVybmFsUmVnaXN0ZXJlZEZ1bmN0aW9uJztcblxuY29uc3QgcmVnaXN0ZXJlZEZ1bmN0aW9uczogeyBbaWRlbnRpZmllcjogc3RyaW5nXTogRnVuY3Rpb24gfCB1bmRlZmluZWQgfSA9IHt9O1xuXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJGdW5jdGlvbihpZGVudGlmaWVyOiBzdHJpbmcsIGltcGxlbWVudGF0aW9uOiBGdW5jdGlvbikge1xuICBpZiAoaW50ZXJuYWxSZWdpc3RlcmVkRnVuY3Rpb25zLmhhc093blByb3BlcnR5KGlkZW50aWZpZXIpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgZnVuY3Rpb24gaWRlbnRpZmllciAnJHtpZGVudGlmaWVyfScgaXMgcmVzZXJ2ZWQgYW5kIGNhbm5vdCBiZSByZWdpc3RlcmVkLmApO1xuICB9XG5cbiAgaWYgKHJlZ2lzdGVyZWRGdW5jdGlvbnMuaGFzT3duUHJvcGVydHkoaWRlbnRpZmllcikpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEEgZnVuY3Rpb24gd2l0aCB0aGUgaWRlbnRpZmllciAnJHtpZGVudGlmaWVyfScgaGFzIGFscmVhZHkgYmVlbiByZWdpc3RlcmVkLmApO1xuICB9XG5cbiAgcmVnaXN0ZXJlZEZ1bmN0aW9uc1tpZGVudGlmaWVyXSA9IGltcGxlbWVudGF0aW9uO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmVnaXN0ZXJlZEZ1bmN0aW9uKGlkZW50aWZpZXI6IHN0cmluZyk6IEZ1bmN0aW9uIHtcbiAgLy8gQnkgcHJpb3JpdGlzaW5nIHRoZSBpbnRlcm5hbCBvbmVzLCB3ZSBlbnN1cmUgeW91IGNhbid0IG92ZXJyaWRlIHRoZW1cbiAgY29uc3QgcmVzdWx0ID0gaW50ZXJuYWxSZWdpc3RlcmVkRnVuY3Rpb25zW2lkZW50aWZpZXJdIHx8IHJlZ2lzdGVyZWRGdW5jdGlvbnNbaWRlbnRpZmllcl07XG4gIGlmIChyZXN1bHQpIHtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgcmVnaXN0ZXJlZCBmdW5jdGlvbiB3aXRoIG5hbWUgJyR7aWRlbnRpZmllcn0nLmApO1xuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvSW50ZXJvcC9SZWdpc3RlcmVkRnVuY3Rpb24udHMiLCJleHBvcnQgZnVuY3Rpb24gZ2V0QXNzZW1ibHlOYW1lRnJvbVVybCh1cmw6IHN0cmluZykge1xuICBjb25zdCBsYXN0U2VnbWVudCA9IHVybC5zdWJzdHJpbmcodXJsLmxhc3RJbmRleE9mKCcvJykgKyAxKTtcbiAgY29uc3QgcXVlcnlTdHJpbmdTdGFydFBvcyA9IGxhc3RTZWdtZW50LmluZGV4T2YoJz8nKTtcbiAgY29uc3QgZmlsZW5hbWUgPSBxdWVyeVN0cmluZ1N0YXJ0UG9zIDwgMCA/IGxhc3RTZWdtZW50IDogbGFzdFNlZ21lbnQuc3Vic3RyaW5nKDAsIHF1ZXJ5U3RyaW5nU3RhcnRQb3MpO1xuICByZXR1cm4gZmlsZW5hbWUucmVwbGFjZSgvXFwuZGxsJC8sICcnKTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9QbGF0Zm9ybS9Eb3ROZXQudHMiLCJpbXBvcnQgeyBTeXN0ZW1fT2JqZWN0LCBTeXN0ZW1fU3RyaW5nLCBTeXN0ZW1fQXJyYXksIE1ldGhvZEhhbmRsZSwgUG9pbnRlciB9IGZyb20gJy4uL1BsYXRmb3JtL1BsYXRmb3JtJztcbmltcG9ydCB7IHBsYXRmb3JtIH0gZnJvbSAnLi4vRW52aXJvbm1lbnQnO1xuaW1wb3J0IHsgcmVuZGVyQmF0Y2ggYXMgcmVuZGVyQmF0Y2hTdHJ1Y3QsIGFycmF5UmFuZ2UsIGFycmF5U2VnbWVudCwgcmVuZGVyVHJlZURpZmZTdHJ1Y3RMZW5ndGgsIHJlbmRlclRyZWVEaWZmLCBSZW5kZXJCYXRjaFBvaW50ZXIsIFJlbmRlclRyZWVEaWZmUG9pbnRlciB9IGZyb20gJy4vUmVuZGVyQmF0Y2gnO1xuaW1wb3J0IHsgQnJvd3NlclJlbmRlcmVyIH0gZnJvbSAnLi9Ccm93c2VyUmVuZGVyZXInO1xuXG50eXBlIEJyb3dzZXJSZW5kZXJlclJlZ2lzdHJ5ID0geyBbYnJvd3NlclJlbmRlcmVySWQ6IG51bWJlcl06IEJyb3dzZXJSZW5kZXJlciB9O1xuY29uc3QgYnJvd3NlclJlbmRlcmVyczogQnJvd3NlclJlbmRlcmVyUmVnaXN0cnkgPSB7fTtcblxuZXhwb3J0IGZ1bmN0aW9uIGF0dGFjaENvbXBvbmVudFRvRWxlbWVudChicm93c2VyUmVuZGVyZXJJZDogbnVtYmVyLCBlbGVtZW50U2VsZWN0b3I6IFN5c3RlbV9TdHJpbmcsIGNvbXBvbmVudElkOiBudW1iZXIpIHtcbiAgY29uc3QgZWxlbWVudFNlbGVjdG9ySnMgPSBwbGF0Zm9ybS50b0phdmFTY3JpcHRTdHJpbmcoZWxlbWVudFNlbGVjdG9yKTtcbiAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWxlbWVudFNlbGVjdG9ySnMpO1xuICBpZiAoIWVsZW1lbnQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIGFueSBlbGVtZW50IG1hdGNoaW5nIHNlbGVjdG9yICcke2VsZW1lbnRTZWxlY3RvckpzfScuYCk7XG4gIH1cblxuICBsZXQgYnJvd3NlclJlbmRlcmVyID0gYnJvd3NlclJlbmRlcmVyc1ticm93c2VyUmVuZGVyZXJJZF07XG4gIGlmICghYnJvd3NlclJlbmRlcmVyKSB7XG4gICAgYnJvd3NlclJlbmRlcmVyID0gYnJvd3NlclJlbmRlcmVyc1ticm93c2VyUmVuZGVyZXJJZF0gPSBuZXcgQnJvd3NlclJlbmRlcmVyKGJyb3dzZXJSZW5kZXJlcklkKTtcbiAgfVxuICBicm93c2VyUmVuZGVyZXIuYXR0YWNoQ29tcG9uZW50VG9FbGVtZW50KGNvbXBvbmVudElkLCBlbGVtZW50KTtcbiAgY2xlYXJFbGVtZW50KGVsZW1lbnQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyQmF0Y2goYnJvd3NlclJlbmRlcmVySWQ6IG51bWJlciwgYmF0Y2g6IFJlbmRlckJhdGNoUG9pbnRlcikge1xuICBjb25zdCBicm93c2VyUmVuZGVyZXIgPSBicm93c2VyUmVuZGVyZXJzW2Jyb3dzZXJSZW5kZXJlcklkXTtcbiAgaWYgKCFicm93c2VyUmVuZGVyZXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZXJlIGlzIG5vIGJyb3dzZXIgcmVuZGVyZXIgd2l0aCBJRCAke2Jyb3dzZXJSZW5kZXJlcklkfS5gKTtcbiAgfVxuICBcbiAgY29uc3QgdXBkYXRlZENvbXBvbmVudHMgPSByZW5kZXJCYXRjaFN0cnVjdC51cGRhdGVkQ29tcG9uZW50cyhiYXRjaCk7XG4gIGNvbnN0IHVwZGF0ZWRDb21wb25lbnRzTGVuZ3RoID0gYXJyYXlSYW5nZS5jb3VudCh1cGRhdGVkQ29tcG9uZW50cyk7XG4gIGNvbnN0IHVwZGF0ZWRDb21wb25lbnRzQXJyYXkgPSBhcnJheVJhbmdlLmFycmF5KHVwZGF0ZWRDb21wb25lbnRzKTtcbiAgY29uc3QgcmVmZXJlbmNlRnJhbWVzU3RydWN0ID0gcmVuZGVyQmF0Y2hTdHJ1Y3QucmVmZXJlbmNlRnJhbWVzKGJhdGNoKTtcbiAgY29uc3QgcmVmZXJlbmNlRnJhbWVzID0gYXJyYXlSYW5nZS5hcnJheShyZWZlcmVuY2VGcmFtZXNTdHJ1Y3QpO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdXBkYXRlZENvbXBvbmVudHNMZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGRpZmYgPSBwbGF0Zm9ybS5nZXRBcnJheUVudHJ5UHRyKHVwZGF0ZWRDb21wb25lbnRzQXJyYXksIGksIHJlbmRlclRyZWVEaWZmU3RydWN0TGVuZ3RoKTtcbiAgICBjb25zdCBjb21wb25lbnRJZCA9IHJlbmRlclRyZWVEaWZmLmNvbXBvbmVudElkKGRpZmYpO1xuXG4gICAgY29uc3QgZWRpdHNBcnJheVNlZ21lbnQgPSByZW5kZXJUcmVlRGlmZi5lZGl0cyhkaWZmKTtcbiAgICBjb25zdCBlZGl0cyA9IGFycmF5U2VnbWVudC5hcnJheShlZGl0c0FycmF5U2VnbWVudCk7XG4gICAgY29uc3QgZWRpdHNPZmZzZXQgPSBhcnJheVNlZ21lbnQub2Zmc2V0KGVkaXRzQXJyYXlTZWdtZW50KTtcbiAgICBjb25zdCBlZGl0c0xlbmd0aCA9IGFycmF5U2VnbWVudC5jb3VudChlZGl0c0FycmF5U2VnbWVudCk7XG5cbiAgICBicm93c2VyUmVuZGVyZXIudXBkYXRlQ29tcG9uZW50KGNvbXBvbmVudElkLCBlZGl0cywgZWRpdHNPZmZzZXQsIGVkaXRzTGVuZ3RoLCByZWZlcmVuY2VGcmFtZXMpO1xuICB9XG5cbiAgY29uc3QgZGlzcG9zZWRDb21wb25lbnRJZHMgPSByZW5kZXJCYXRjaFN0cnVjdC5kaXNwb3NlZENvbXBvbmVudElkcyhiYXRjaCk7XG4gIGNvbnN0IGRpc3Bvc2VkQ29tcG9uZW50SWRzTGVuZ3RoID0gYXJyYXlSYW5nZS5jb3VudChkaXNwb3NlZENvbXBvbmVudElkcyk7XG4gIGNvbnN0IGRpc3Bvc2VkQ29tcG9uZW50SWRzQXJyYXkgPSBhcnJheVJhbmdlLmFycmF5KGRpc3Bvc2VkQ29tcG9uZW50SWRzKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaXNwb3NlZENvbXBvbmVudElkc0xlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgY29tcG9uZW50SWRQdHIgPSBwbGF0Zm9ybS5nZXRBcnJheUVudHJ5UHRyKGRpc3Bvc2VkQ29tcG9uZW50SWRzQXJyYXksIGksIDQpO1xuICAgIGNvbnN0IGNvbXBvbmVudElkID0gcGxhdGZvcm0ucmVhZEludDMyRmllbGQoY29tcG9uZW50SWRQdHIpO1xuICAgIGJyb3dzZXJSZW5kZXJlci5kaXNwb3NlQ29tcG9uZW50KGNvbXBvbmVudElkKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjbGVhckVsZW1lbnQoZWxlbWVudDogRWxlbWVudCkge1xuICBsZXQgY2hpbGROb2RlOiBOb2RlIHwgbnVsbDtcbiAgd2hpbGUgKGNoaWxkTm9kZSA9IGVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgIGVsZW1lbnQucmVtb3ZlQ2hpbGQoY2hpbGROb2RlKTtcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1JlbmRlcmluZy9SZW5kZXJlci50cyIsImltcG9ydCB7IHBsYXRmb3JtIH0gZnJvbSAnLi9FbnZpcm9ubWVudCc7XG5pbXBvcnQgeyBnZXRBc3NlbWJseU5hbWVGcm9tVXJsIH0gZnJvbSAnLi9QbGF0Zm9ybS9Eb3ROZXQnO1xuaW1wb3J0ICcuL1JlbmRlcmluZy9SZW5kZXJlcic7XG5pbXBvcnQgJy4vU2VydmljZXMvSHR0cCc7XG5pbXBvcnQgJy4vU2VydmljZXMvVXJpSGVscGVyJztcbmltcG9ydCAnLi9HbG9iYWxFeHBvcnRzJztcblxuYXN5bmMgZnVuY3Rpb24gYm9vdCgpIHtcbiAgLy8gUmVhZCBzdGFydHVwIGNvbmZpZyBmcm9tIHRoZSA8c2NyaXB0PiBlbGVtZW50IHRoYXQncyBpbXBvcnRpbmcgdGhpcyBmaWxlXG4gIGNvbnN0IGFsbFNjcmlwdEVsZW1zID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpO1xuICBjb25zdCB0aGlzU2NyaXB0RWxlbSA9IChkb2N1bWVudC5jdXJyZW50U2NyaXB0IHx8IGFsbFNjcmlwdEVsZW1zW2FsbFNjcmlwdEVsZW1zLmxlbmd0aCAtIDFdKSBhcyBIVE1MU2NyaXB0RWxlbWVudDtcbiAgY29uc3QgZW50cnlQb2ludERsbCA9IGdldFJlcXVpcmVkQm9vdFNjcmlwdEF0dHJpYnV0ZSh0aGlzU2NyaXB0RWxlbSwgJ21haW4nKTtcbiAgY29uc3QgZW50cnlQb2ludE1ldGhvZCA9IGdldFJlcXVpcmVkQm9vdFNjcmlwdEF0dHJpYnV0ZSh0aGlzU2NyaXB0RWxlbSwgJ2VudHJ5cG9pbnQnKTtcbiAgY29uc3QgZW50cnlQb2ludEFzc2VtYmx5TmFtZSA9IGdldEFzc2VtYmx5TmFtZUZyb21VcmwoZW50cnlQb2ludERsbCk7XG4gIGNvbnN0IHJlZmVyZW5jZUFzc2VtYmxpZXNDb21tYVNlcGFyYXRlZCA9IHRoaXNTY3JpcHRFbGVtLmdldEF0dHJpYnV0ZSgncmVmZXJlbmNlcycpIHx8ICcnO1xuICBjb25zdCByZWZlcmVuY2VBc3NlbWJsaWVzID0gcmVmZXJlbmNlQXNzZW1ibGllc0NvbW1hU2VwYXJhdGVkXG4gICAgLnNwbGl0KCcsJylcbiAgICAubWFwKHMgPT4gcy50cmltKCkpXG4gICAgLmZpbHRlcihzID0+ICEhcyk7XG5cbiAgLy8gRGV0ZXJtaW5lIHRoZSBVUkxzIG9mIHRoZSBhc3NlbWJsaWVzIHdlIHdhbnQgdG8gbG9hZFxuICBjb25zdCBsb2FkQXNzZW1ibHlVcmxzID0gW2VudHJ5UG9pbnREbGxdXG4gICAgLmNvbmNhdChyZWZlcmVuY2VBc3NlbWJsaWVzKVxuICAgIC5tYXAoZmlsZW5hbWUgPT4gYF9mcmFtZXdvcmsvX2Jpbi8ke2ZpbGVuYW1lfWApO1xuXG4gIHRyeSB7XG4gICAgYXdhaXQgcGxhdGZvcm0uc3RhcnQobG9hZEFzc2VtYmx5VXJscyk7XG4gIH0gY2F0Y2ggKGV4KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBGYWlsZWQgdG8gc3RhcnQgcGxhdGZvcm0uIFJlYXNvbjogJHtleH1gKTtcbiAgfVxuXG4gIC8vIFN0YXJ0IHVwIHRoZSBhcHBsaWNhdGlvblxuICBwbGF0Zm9ybS5jYWxsRW50cnlQb2ludChlbnRyeVBvaW50QXNzZW1ibHlOYW1lLCBlbnRyeVBvaW50TWV0aG9kLCBbXSk7XG59XG5cbmZ1bmN0aW9uIGdldFJlcXVpcmVkQm9vdFNjcmlwdEF0dHJpYnV0ZShlbGVtOiBIVE1MU2NyaXB0RWxlbWVudCwgYXR0cmlidXRlTmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgcmVzdWx0ID0gZWxlbS5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSk7XG4gIGlmICghcmVzdWx0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBNaXNzaW5nIFwiJHthdHRyaWJ1dGVOYW1lfVwiIGF0dHJpYnV0ZSBvbiBCbGF6b3Igc2NyaXB0IHRhZy5gKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5ib290KCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvQm9vdC50cyIsImltcG9ydCB7IE1ldGhvZEhhbmRsZSwgU3lzdGVtX09iamVjdCwgU3lzdGVtX1N0cmluZywgU3lzdGVtX0FycmF5LCBQb2ludGVyLCBQbGF0Zm9ybSB9IGZyb20gJy4uL1BsYXRmb3JtJztcbmltcG9ydCB7IGdldEFzc2VtYmx5TmFtZUZyb21VcmwgfSBmcm9tICcuLi9Eb3ROZXQnO1xuaW1wb3J0IHsgZ2V0UmVnaXN0ZXJlZEZ1bmN0aW9uIH0gZnJvbSAnLi4vLi4vSW50ZXJvcC9SZWdpc3RlcmVkRnVuY3Rpb24nO1xuXG5sZXQgYXNzZW1ibHlfbG9hZDogKGFzc2VtYmx5TmFtZTogc3RyaW5nKSA9PiBudW1iZXI7XG5sZXQgZmluZF9jbGFzczogKGFzc2VtYmx5SGFuZGxlOiBudW1iZXIsIG5hbWVzcGFjZTogc3RyaW5nLCBjbGFzc05hbWU6IHN0cmluZykgPT4gbnVtYmVyO1xubGV0IGZpbmRfbWV0aG9kOiAodHlwZUhhbmRsZTogbnVtYmVyLCBtZXRob2ROYW1lOiBzdHJpbmcsIHVua25vd25Bcmc6IG51bWJlcikgPT4gTWV0aG9kSGFuZGxlO1xubGV0IGludm9rZV9tZXRob2Q6IChtZXRob2Q6IE1ldGhvZEhhbmRsZSwgdGFyZ2V0OiBTeXN0ZW1fT2JqZWN0LCBhcmdzQXJyYXlQdHI6IG51bWJlciwgZXhjZXB0aW9uRmxhZ0ludFB0cjogbnVtYmVyKSA9PiBTeXN0ZW1fT2JqZWN0O1xubGV0IG1vbm9fc3RyaW5nX2dldF91dGY4OiAobWFuYWdlZFN0cmluZzogU3lzdGVtX1N0cmluZykgPT4gTW9uby5VdGY4UHRyO1xubGV0IG1vbm9fc3RyaW5nOiAoanNTdHJpbmc6IHN0cmluZykgPT4gU3lzdGVtX1N0cmluZztcblxuZXhwb3J0IGNvbnN0IG1vbm9QbGF0Zm9ybTogUGxhdGZvcm0gPSB7XG4gIHN0YXJ0OiBmdW5jdGlvbiBzdGFydChsb2FkQXNzZW1ibHlVcmxzOiBzdHJpbmdbXSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAvLyBtb25vLmpzIGFzc3VtZXMgdGhlIGV4aXN0ZW5jZSBvZiB0aGlzXG4gICAgICB3aW5kb3dbJ0Jyb3dzZXInXSA9IHtcbiAgICAgICAgaW5pdDogKCkgPT4geyB9LFxuICAgICAgICBhc3luY0xvYWQ6IGFzeW5jTG9hZFxuICAgICAgfTtcblxuICAgICAgLy8gRW1zY3JpcHRlbiB3b3JrcyBieSBleHBlY3RpbmcgdGhlIG1vZHVsZSBjb25maWcgdG8gYmUgYSBnbG9iYWxcbiAgICAgIHdpbmRvd1snTW9kdWxlJ10gPSBjcmVhdGVFbXNjcmlwdGVuTW9kdWxlSW5zdGFuY2UobG9hZEFzc2VtYmx5VXJscywgcmVzb2x2ZSwgcmVqZWN0KTtcblxuICAgICAgYWRkU2NyaXB0VGFnc1RvRG9jdW1lbnQoKTtcbiAgICB9KTtcbiAgfSxcblxuICBmaW5kTWV0aG9kOiBmdW5jdGlvbiBmaW5kTWV0aG9kKGFzc2VtYmx5TmFtZTogc3RyaW5nLCBuYW1lc3BhY2U6IHN0cmluZywgY2xhc3NOYW1lOiBzdHJpbmcsIG1ldGhvZE5hbWU6IHN0cmluZyk6IE1ldGhvZEhhbmRsZSB7XG4gICAgLy8gVE9ETzogQ2FjaGUgdGhlIGFzc2VtYmx5X2xvYWQgb3V0cHV0cz9cbiAgICBjb25zdCBhc3NlbWJseUhhbmRsZSA9IGFzc2VtYmx5X2xvYWQoYXNzZW1ibHlOYW1lKTtcbiAgICBpZiAoIWFzc2VtYmx5SGFuZGxlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIGFzc2VtYmx5IFwiJHthc3NlbWJseU5hbWV9XCJgKTtcbiAgICB9XG5cbiAgICBjb25zdCB0eXBlSGFuZGxlID0gZmluZF9jbGFzcyhhc3NlbWJseUhhbmRsZSwgbmFtZXNwYWNlLCBjbGFzc05hbWUpO1xuICAgIGlmICghdHlwZUhhbmRsZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCB0eXBlIFwiJHtjbGFzc05hbWV9XCIgaW4gbmFtZXNwYWNlIFwiJHtuYW1lc3BhY2V9XCIgaW4gYXNzZW1ibHkgXCIke2Fzc2VtYmx5TmFtZX1cImApO1xuICAgIH1cblxuICAgIGNvbnN0IG1ldGhvZEhhbmRsZSA9IGZpbmRfbWV0aG9kKHR5cGVIYW5kbGUsIG1ldGhvZE5hbWUsIC0xKTtcbiAgICBpZiAoIW1ldGhvZEhhbmRsZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBtZXRob2QgXCIke21ldGhvZE5hbWV9XCIgb24gdHlwZSBcIiR7bmFtZXNwYWNlfS4ke2NsYXNzTmFtZX1cImApO1xuICAgIH1cblxuICAgIHJldHVybiBtZXRob2RIYW5kbGU7XG4gIH0sXG5cbiAgY2FsbEVudHJ5UG9pbnQ6IGZ1bmN0aW9uIGNhbGxFbnRyeVBvaW50KGFzc2VtYmx5TmFtZTogc3RyaW5nLCBlbnRyeXBvaW50TWV0aG9kOiBzdHJpbmcsIGFyZ3M6IFN5c3RlbV9PYmplY3RbXSk6IHZvaWQge1xuICAgIC8vIFBhcnNlIHRoZSBlbnRyeXBvaW50TWV0aG9kLCB3aGljaCBpcyBvZiB0aGUgZm9ybSBNeUFwcC5NeU5hbWVzcGFjZS5NeVR5cGVOYW1lOjpNeU1ldGhvZE5hbWVcbiAgICAvLyBOb3RlIHRoYXQgd2UgZG9uJ3Qgc3VwcG9ydCBzcGVjaWZ5aW5nIGEgbWV0aG9kIG92ZXJsb2FkLCBzbyBpdCBoYXMgdG8gYmUgdW5pcXVlXG4gICAgY29uc3QgZW50cnlwb2ludFNlZ21lbnRzID0gZW50cnlwb2ludE1ldGhvZC5zcGxpdCgnOjonKTtcbiAgICBpZiAoZW50cnlwb2ludFNlZ21lbnRzLmxlbmd0aCAhPSAyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ01hbGZvcm1lZCBlbnRyeSBwb2ludCBtZXRob2QgbmFtZTsgY291bGQgbm90IHJlc29sdmUgY2xhc3MgbmFtZSBhbmQgbWV0aG9kIG5hbWUuJyk7XG4gICAgfVxuICAgIGNvbnN0IHR5cGVGdWxsTmFtZSA9IGVudHJ5cG9pbnRTZWdtZW50c1swXTtcbiAgICBjb25zdCBtZXRob2ROYW1lID0gZW50cnlwb2ludFNlZ21lbnRzWzFdO1xuICAgIGNvbnN0IGxhc3REb3QgPSB0eXBlRnVsbE5hbWUubGFzdEluZGV4T2YoJy4nKTtcbiAgICBjb25zdCBuYW1lc3BhY2UgPSBsYXN0RG90ID4gLTEgPyB0eXBlRnVsbE5hbWUuc3Vic3RyaW5nKDAsIGxhc3REb3QpIDogJyc7XG4gICAgY29uc3QgdHlwZVNob3J0TmFtZSA9IGxhc3REb3QgPiAtMSA/IHR5cGVGdWxsTmFtZS5zdWJzdHJpbmcobGFzdERvdCArIDEpIDogdHlwZUZ1bGxOYW1lO1xuXG4gICAgY29uc3QgZW50cnlQb2ludE1ldGhvZEhhbmRsZSA9IG1vbm9QbGF0Zm9ybS5maW5kTWV0aG9kKGFzc2VtYmx5TmFtZSwgbmFtZXNwYWNlLCB0eXBlU2hvcnROYW1lLCBtZXRob2ROYW1lKTtcbiAgICBtb25vUGxhdGZvcm0uY2FsbE1ldGhvZChlbnRyeVBvaW50TWV0aG9kSGFuZGxlLCBudWxsLCBhcmdzKTtcbiAgfSxcblxuICBjYWxsTWV0aG9kOiBmdW5jdGlvbiBjYWxsTWV0aG9kKG1ldGhvZDogTWV0aG9kSGFuZGxlLCB0YXJnZXQ6IFN5c3RlbV9PYmplY3QsIGFyZ3M6IFN5c3RlbV9PYmplY3RbXSk6IFN5c3RlbV9PYmplY3Qge1xuICAgIGlmIChhcmdzLmxlbmd0aCA+IDQpIHtcbiAgICAgIC8vIEhvcGVmdWxseSB0aGlzIHJlc3RyaWN0aW9uIGNhbiBiZSBlYXNlZCBzb29uLCBidXQgZm9yIG5vdyBtYWtlIGl0IGNsZWFyIHdoYXQncyBnb2luZyBvblxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDdXJyZW50bHksIE1vbm9QbGF0Zm9ybSBzdXBwb3J0cyBwYXNzaW5nIGEgbWF4aW11bSBvZiA0IGFyZ3VtZW50cyBmcm9tIEpTIHRvIC5ORVQuIFlvdSB0cmllZCB0byBwYXNzICR7YXJncy5sZW5ndGh9LmApO1xuICAgIH1cblxuICAgIGNvbnN0IHN0YWNrID0gTW9kdWxlLnN0YWNrU2F2ZSgpO1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGFyZ3NCdWZmZXIgPSBNb2R1bGUuc3RhY2tBbGxvYyhhcmdzLmxlbmd0aCk7XG4gICAgICBjb25zdCBleGNlcHRpb25GbGFnTWFuYWdlZEludCA9IE1vZHVsZS5zdGFja0FsbG9jKDQpO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIE1vZHVsZS5zZXRWYWx1ZShhcmdzQnVmZmVyICsgaSAqIDQsIGFyZ3NbaV0sICdpMzInKTtcbiAgICAgIH1cbiAgICAgIE1vZHVsZS5zZXRWYWx1ZShleGNlcHRpb25GbGFnTWFuYWdlZEludCwgMCwgJ2kzMicpO1xuXG4gICAgICBjb25zdCByZXMgPSBpbnZva2VfbWV0aG9kKG1ldGhvZCwgdGFyZ2V0LCBhcmdzQnVmZmVyLCBleGNlcHRpb25GbGFnTWFuYWdlZEludCk7XG5cbiAgICAgIGlmIChNb2R1bGUuZ2V0VmFsdWUoZXhjZXB0aW9uRmxhZ01hbmFnZWRJbnQsICdpMzInKSAhPT0gMCkge1xuICAgICAgICAvLyBJZiB0aGUgZXhjZXB0aW9uIGZsYWcgaXMgc2V0LCB0aGUgcmV0dXJuZWQgdmFsdWUgaXMgZXhjZXB0aW9uLlRvU3RyaW5nKClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1vbm9QbGF0Zm9ybS50b0phdmFTY3JpcHRTdHJpbmcoPFN5c3RlbV9TdHJpbmc+cmVzKSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXM7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIE1vZHVsZS5zdGFja1Jlc3RvcmUoc3RhY2spO1xuICAgIH1cbiAgfSxcblxuICB0b0phdmFTY3JpcHRTdHJpbmc6IGZ1bmN0aW9uIHRvSmF2YVNjcmlwdFN0cmluZyhtYW5hZ2VkU3RyaW5nOiBTeXN0ZW1fU3RyaW5nKSB7XG4gICAgLy8gQ29tbWVudHMgZnJvbSBvcmlnaW5hbCBNb25vIHNhbXBsZTpcbiAgICAvL0ZJWE1FIHRoaXMgaXMgd2FzdGVmdWxsLCB3ZSBjb3VsZCByZW1vdmUgdGhlIHRlbXAgbWFsbG9jIGJ5IGdvaW5nIHRoZSBVVEYxNiByb3V0ZVxuICAgIC8vRklYTUUgdGhpcyBpcyB1bnNhZmUsIGN1eiByYXcgb2JqZWN0cyBjb3VsZCBiZSBHQydkLlxuXG4gICAgY29uc3QgdXRmOCA9IG1vbm9fc3RyaW5nX2dldF91dGY4KG1hbmFnZWRTdHJpbmcpO1xuICAgIGNvbnN0IHJlcyA9IE1vZHVsZS5VVEY4VG9TdHJpbmcodXRmOCk7XG4gICAgTW9kdWxlLl9mcmVlKHV0ZjggYXMgYW55KTtcbiAgICByZXR1cm4gcmVzO1xuICB9LFxuXG4gIHRvRG90TmV0U3RyaW5nOiBmdW5jdGlvbiB0b0RvdE5ldFN0cmluZyhqc1N0cmluZzogc3RyaW5nKTogU3lzdGVtX1N0cmluZyB7XG4gICAgcmV0dXJuIG1vbm9fc3RyaW5nKGpzU3RyaW5nKTtcbiAgfSxcblxuICBnZXRBcnJheUxlbmd0aDogZnVuY3Rpb24gZ2V0QXJyYXlMZW5ndGgoYXJyYXk6IFN5c3RlbV9BcnJheTxhbnk+KTogbnVtYmVyIHtcbiAgICByZXR1cm4gTW9kdWxlLmdldFZhbHVlKGdldEFycmF5RGF0YVBvaW50ZXIoYXJyYXkpLCAnaTMyJyk7XG4gIH0sXG5cbiAgZ2V0QXJyYXlFbnRyeVB0cjogZnVuY3Rpb24gZ2V0QXJyYXlFbnRyeVB0cjxUUHRyIGV4dGVuZHMgUG9pbnRlcj4oYXJyYXk6IFN5c3RlbV9BcnJheTxUUHRyPiwgaW5kZXg6IG51bWJlciwgaXRlbVNpemU6IG51bWJlcik6IFRQdHIge1xuICAgIC8vIEZpcnN0IGJ5dGUgaXMgYXJyYXkgbGVuZ3RoLCBmb2xsb3dlZCBieSBlbnRyaWVzXG4gICAgY29uc3QgYWRkcmVzcyA9IGdldEFycmF5RGF0YVBvaW50ZXIoYXJyYXkpICsgNCArIGluZGV4ICogaXRlbVNpemU7XG4gICAgcmV0dXJuIGFkZHJlc3MgYXMgYW55IGFzIFRQdHI7XG4gIH0sXG5cbiAgZ2V0T2JqZWN0RmllbGRzQmFzZUFkZHJlc3M6IGZ1bmN0aW9uIGdldE9iamVjdEZpZWxkc0Jhc2VBZGRyZXNzKHJlZmVyZW5jZVR5cGVkT2JqZWN0OiBTeXN0ZW1fT2JqZWN0KTogUG9pbnRlciB7XG4gICAgLy8gVGhlIGZpcnN0IHR3byBpbnQzMiB2YWx1ZXMgYXJlIGludGVybmFsIE1vbm8gZGF0YVxuICAgIHJldHVybiAocmVmZXJlbmNlVHlwZWRPYmplY3QgYXMgYW55IGFzIG51bWJlciArIDgpIGFzIGFueSBhcyBQb2ludGVyO1xuICB9LFxuXG4gIHJlYWRJbnQzMkZpZWxkOiBmdW5jdGlvbiByZWFkSGVhcEludDMyKGJhc2VBZGRyZXNzOiBQb2ludGVyLCBmaWVsZE9mZnNldD86IG51bWJlcik6IG51bWJlciB7XG4gICAgcmV0dXJuIE1vZHVsZS5nZXRWYWx1ZSgoYmFzZUFkZHJlc3MgYXMgYW55IGFzIG51bWJlcikgKyAoZmllbGRPZmZzZXQgfHwgMCksICdpMzInKTtcbiAgfSxcblxuICByZWFkT2JqZWN0RmllbGQ6IGZ1bmN0aW9uIHJlYWRIZWFwT2JqZWN0PFQgZXh0ZW5kcyBTeXN0ZW1fT2JqZWN0PihiYXNlQWRkcmVzczogUG9pbnRlciwgZmllbGRPZmZzZXQ/OiBudW1iZXIpOiBUIHtcbiAgICByZXR1cm4gTW9kdWxlLmdldFZhbHVlKChiYXNlQWRkcmVzcyBhcyBhbnkgYXMgbnVtYmVyKSArIChmaWVsZE9mZnNldCB8fCAwKSwgJ2kzMicpIGFzIGFueSBhcyBUO1xuICB9LFxuXG4gIHJlYWRTdHJpbmdGaWVsZDogZnVuY3Rpb24gcmVhZEhlYXBPYmplY3QoYmFzZUFkZHJlc3M6IFBvaW50ZXIsIGZpZWxkT2Zmc2V0PzogbnVtYmVyKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgY29uc3QgZmllbGRWYWx1ZSA9IE1vZHVsZS5nZXRWYWx1ZSgoYmFzZUFkZHJlc3MgYXMgYW55IGFzIG51bWJlcikgKyAoZmllbGRPZmZzZXQgfHwgMCksICdpMzInKTtcbiAgICByZXR1cm4gZmllbGRWYWx1ZSA9PT0gMCA/IG51bGwgOiBtb25vUGxhdGZvcm0udG9KYXZhU2NyaXB0U3RyaW5nKGZpZWxkVmFsdWUgYXMgYW55IGFzIFN5c3RlbV9TdHJpbmcpO1xuICB9LFxuXG4gIHJlYWRTdHJ1Y3RGaWVsZDogZnVuY3Rpb24gcmVhZFN0cnVjdEZpZWxkPFQgZXh0ZW5kcyBQb2ludGVyPihiYXNlQWRkcmVzczogUG9pbnRlciwgZmllbGRPZmZzZXQ/OiBudW1iZXIpOiBUIHtcbiAgICByZXR1cm4gKChiYXNlQWRkcmVzcyBhcyBhbnkgYXMgbnVtYmVyKSArIChmaWVsZE9mZnNldCB8fCAwKSkgYXMgYW55IGFzIFQ7XG4gIH0sXG59O1xuXG4vLyBCeXBhc3Mgbm9ybWFsIHR5cGUgY2hlY2tpbmcgdG8gYWRkIHRoaXMgZXh0cmEgZnVuY3Rpb24uIEl0J3Mgb25seSBpbnRlbmRlZCB0byBiZSBjYWxsZWQgZnJvbVxuLy8gdGhlIEpTIGNvZGUgaW4gTW9ubydzIGRyaXZlci5jLiBJdCdzIG5ldmVyIGludGVuZGVkIHRvIGJlIGNhbGxlZCBmcm9tIFR5cGVTY3JpcHQuXG4obW9ub1BsYXRmb3JtIGFzIGFueSkubW9ub0dldFJlZ2lzdGVyZWRGdW5jdGlvbiA9IGdldFJlZ2lzdGVyZWRGdW5jdGlvbjtcblxuZnVuY3Rpb24gYWRkU2NyaXB0VGFnc1RvRG9jdW1lbnQoKSB7XG4gIC8vIExvYWQgZWl0aGVyIHRoZSB3YXNtIG9yIGFzbS5qcyB2ZXJzaW9uIG9mIHRoZSBNb25vIHJ1bnRpbWVcbiAgY29uc3QgYnJvd3NlclN1cHBvcnRzTmF0aXZlV2ViQXNzZW1ibHkgPSB0eXBlb2YgV2ViQXNzZW1ibHkgIT09ICd1bmRlZmluZWQnICYmIFdlYkFzc2VtYmx5LnZhbGlkYXRlO1xuICBjb25zdCBtb25vUnVudGltZVVybEJhc2UgPSAnX2ZyYW1ld29yay8nICsgKGJyb3dzZXJTdXBwb3J0c05hdGl2ZVdlYkFzc2VtYmx5ID8gJ3dhc20nIDogJ2FzbWpzJyk7XG4gIGNvbnN0IG1vbm9SdW50aW1lU2NyaXB0VXJsID0gYCR7bW9ub1J1bnRpbWVVcmxCYXNlfS9tb25vLmpzYDtcblxuICBpZiAoIWJyb3dzZXJTdXBwb3J0c05hdGl2ZVdlYkFzc2VtYmx5KSB7XG4gICAgLy8gSW4gdGhlIGFzbWpzIGNhc2UsIHRoZSBpbml0aWFsIG1lbW9yeSBzdHJ1Y3R1cmUgaXMgaW4gYSBzZXBhcmF0ZSBmaWxlIHdlIG5lZWQgdG8gZG93bmxvYWRcbiAgICBjb25zdCBtZW1pbml0WEhSID0gTW9kdWxlWydtZW1vcnlJbml0aWFsaXplclJlcXVlc3QnXSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIG1lbWluaXRYSFIub3BlbignR0VUJywgYCR7bW9ub1J1bnRpbWVVcmxCYXNlfS9tb25vLmpzLm1lbWApO1xuICAgIG1lbWluaXRYSFIucmVzcG9uc2VUeXBlID0gJ2FycmF5YnVmZmVyJztcbiAgICBtZW1pbml0WEhSLnNlbmQobnVsbCk7XG4gIH1cblxuICBkb2N1bWVudC53cml0ZShgPHNjcmlwdCBkZWZlciBzcmM9XCIke21vbm9SdW50aW1lU2NyaXB0VXJsfVwiPjwvc2NyaXB0PmApO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVFbXNjcmlwdGVuTW9kdWxlSW5zdGFuY2UobG9hZEFzc2VtYmx5VXJsczogc3RyaW5nW10sIG9uUmVhZHk6ICgpID0+IHZvaWQsIG9uRXJyb3I6IChyZWFzb24/OiBhbnkpID0+IHZvaWQpIHtcbiAgY29uc3QgbW9kdWxlID0ge30gYXMgdHlwZW9mIE1vZHVsZTtcbiAgY29uc3Qgd2FzbUJpbmFyeUZpbGUgPSAnX2ZyYW1ld29yay93YXNtL21vbm8ud2FzbSc7XG4gIGNvbnN0IGFzbWpzQ29kZUZpbGUgPSAnX2ZyYW1ld29yay9hc21qcy9tb25vLmFzbS5qcyc7XG5cbiAgbW9kdWxlLnByaW50ID0gbGluZSA9PiBjb25zb2xlLmxvZyhgV0FTTTogJHtsaW5lfWApO1xuICBtb2R1bGUucHJpbnRFcnIgPSBsaW5lID0+IGNvbnNvbGUuZXJyb3IoYFdBU006ICR7bGluZX1gKTtcbiAgbW9kdWxlLnByZVJ1biA9IFtdO1xuICBtb2R1bGUucG9zdFJ1biA9IFtdO1xuICBtb2R1bGUucHJlbG9hZFBsdWdpbnMgPSBbXTtcblxuICBtb2R1bGUubG9jYXRlRmlsZSA9IGZpbGVOYW1lID0+IHtcbiAgICBzd2l0Y2ggKGZpbGVOYW1lKSB7XG4gICAgICBjYXNlICdtb25vLndhc20nOiByZXR1cm4gd2FzbUJpbmFyeUZpbGU7XG4gICAgICBjYXNlICdtb25vLmFzbS5qcyc6IHJldHVybiBhc21qc0NvZGVGaWxlO1xuICAgICAgZGVmYXVsdDogcmV0dXJuIGZpbGVOYW1lO1xuICAgIH1cbiAgfTtcblxuICBtb2R1bGUucHJlUnVuLnB1c2goKCkgPT4ge1xuICAgIC8vIEJ5IG5vdywgZW1zY3JpcHRlbiBzaG91bGQgYmUgaW5pdGlhbGlzZWQgZW5vdWdoIHRoYXQgd2UgY2FuIGNhcHR1cmUgdGhlc2UgbWV0aG9kcyBmb3IgbGF0ZXIgdXNlXG4gICAgYXNzZW1ibHlfbG9hZCA9IE1vZHVsZS5jd3JhcCgnbW9ub193YXNtX2Fzc2VtYmx5X2xvYWQnLCAnbnVtYmVyJywgWydzdHJpbmcnXSk7XG4gICAgZmluZF9jbGFzcyA9IE1vZHVsZS5jd3JhcCgnbW9ub193YXNtX2Fzc2VtYmx5X2ZpbmRfY2xhc3MnLCAnbnVtYmVyJywgWydudW1iZXInLCAnc3RyaW5nJywgJ3N0cmluZyddKTtcbiAgICBmaW5kX21ldGhvZCA9IE1vZHVsZS5jd3JhcCgnbW9ub193YXNtX2Fzc2VtYmx5X2ZpbmRfbWV0aG9kJywgJ251bWJlcicsIFsnbnVtYmVyJywgJ3N0cmluZycsICdudW1iZXInXSk7XG4gICAgaW52b2tlX21ldGhvZCA9IE1vZHVsZS5jd3JhcCgnbW9ub193YXNtX2ludm9rZV9tZXRob2QnLCAnbnVtYmVyJywgWydudW1iZXInLCAnbnVtYmVyJywgJ251bWJlciddKTtcbiAgICBtb25vX3N0cmluZ19nZXRfdXRmOCA9IE1vZHVsZS5jd3JhcCgnbW9ub193YXNtX3N0cmluZ19nZXRfdXRmOCcsICdudW1iZXInLCBbJ251bWJlciddKTtcbiAgICBtb25vX3N0cmluZyA9IE1vZHVsZS5jd3JhcCgnbW9ub193YXNtX3N0cmluZ19mcm9tX2pzJywgJ251bWJlcicsIFsnc3RyaW5nJ10pO1xuXG4gICAgTW9kdWxlLkZTX2NyZWF0ZVBhdGgoJy8nLCAnYXBwQmluRGlyJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgbG9hZEFzc2VtYmx5VXJscy5mb3JFYWNoKHVybCA9PlxuICAgICAgRlMuY3JlYXRlUHJlbG9hZGVkRmlsZSgnYXBwQmluRGlyJywgYCR7Z2V0QXNzZW1ibHlOYW1lRnJvbVVybCh1cmwpfS5kbGxgLCB1cmwsIHRydWUsIGZhbHNlLCB1bmRlZmluZWQsIG9uRXJyb3IpKTtcbiAgfSk7XG5cbiAgbW9kdWxlLnBvc3RSdW4ucHVzaCgoKSA9PiB7XG4gICAgY29uc3QgbG9hZF9ydW50aW1lID0gTW9kdWxlLmN3cmFwKCdtb25vX3dhc21fbG9hZF9ydW50aW1lJywgbnVsbCwgWydzdHJpbmcnXSk7XG4gICAgbG9hZF9ydW50aW1lKCdhcHBCaW5EaXInKTtcbiAgICBvblJlYWR5KCk7XG4gIH0pO1xuXG4gIHJldHVybiBtb2R1bGU7XG59XG5cbmZ1bmN0aW9uIGFzeW5jTG9hZCh1cmwsIG9ubG9hZCwgb25lcnJvcikge1xuICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0O1xuICB4aHIub3BlbignR0VUJywgdXJsLCAvKiBhc3luYzogKi8gdHJ1ZSk7XG4gIHhoci5yZXNwb25zZVR5cGUgPSAnYXJyYXlidWZmZXInO1xuICB4aHIub25sb2FkID0gZnVuY3Rpb24geGhyX29ubG9hZCgpIHtcbiAgICBpZiAoeGhyLnN0YXR1cyA9PSAyMDAgfHwgeGhyLnN0YXR1cyA9PSAwICYmIHhoci5yZXNwb25zZSkge1xuICAgICAgdmFyIGFzbSA9IG5ldyBVaW50OEFycmF5KHhoci5yZXNwb25zZSk7XG4gICAgICBvbmxvYWQoYXNtKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb25lcnJvcih4aHIpO1xuICAgIH1cbiAgfTtcbiAgeGhyLm9uZXJyb3IgPSBvbmVycm9yO1xuICB4aHIuc2VuZChudWxsKTtcbn1cblxuZnVuY3Rpb24gZ2V0QXJyYXlEYXRhUG9pbnRlcjxUPihhcnJheTogU3lzdGVtX0FycmF5PFQ+KTogbnVtYmVyIHtcbiAgcmV0dXJuIDxudW1iZXI+PGFueT5hcnJheSArIDEyOyAvLyBGaXJzdCBieXRlIGZyb20gaGVyZSBpcyBsZW5ndGgsIHRoZW4gZm9sbG93aW5nIGJ5dGVzIGFyZSBlbnRyaWVzXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvUGxhdGZvcm0vTW9uby9Nb25vUGxhdGZvcm0udHMiLCJpbXBvcnQgeyBpbnZva2VXaXRoSnNvbk1hcnNoYWxsaW5nIH0gZnJvbSAnLi9JbnZva2VXaXRoSnNvbk1hcnNoYWxsaW5nJztcbmltcG9ydCB7IGF0dGFjaENvbXBvbmVudFRvRWxlbWVudCwgcmVuZGVyQmF0Y2ggfSBmcm9tICcuLi9SZW5kZXJpbmcvUmVuZGVyZXInO1xuXG4vKipcbiAqIFRoZSBkZWZpbml0aXZlIGxpc3Qgb2YgaW50ZXJuYWwgZnVuY3Rpb25zIGludm9rYWJsZSBmcm9tIC5ORVQgY29kZS5cbiAqIFRoZXNlIGZ1bmN0aW9uIG5hbWVzIGFyZSB0cmVhdGVkIGFzICdyZXNlcnZlZCcgYW5kIGNhbm5vdCBiZSBwYXNzZWQgdG8gcmVnaXN0ZXJGdW5jdGlvbi5cbiAqL1xuZXhwb3J0IGNvbnN0IGludGVybmFsUmVnaXN0ZXJlZEZ1bmN0aW9ucyA9IHtcbiAgYXR0YWNoQ29tcG9uZW50VG9FbGVtZW50LFxuICBpbnZva2VXaXRoSnNvbk1hcnNoYWxsaW5nLFxuICByZW5kZXJCYXRjaCxcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvSW50ZXJvcC9JbnRlcm5hbFJlZ2lzdGVyZWRGdW5jdGlvbi50cyIsImltcG9ydCB7IHBsYXRmb3JtIH0gZnJvbSAnLi4vRW52aXJvbm1lbnQnO1xuaW1wb3J0IHsgU3lzdGVtX1N0cmluZyB9IGZyb20gJy4uL1BsYXRmb3JtL1BsYXRmb3JtJztcbmltcG9ydCB7IGdldFJlZ2lzdGVyZWRGdW5jdGlvbiB9IGZyb20gJy4vUmVnaXN0ZXJlZEZ1bmN0aW9uJztcblxuZXhwb3J0IGZ1bmN0aW9uIGludm9rZVdpdGhKc29uTWFyc2hhbGxpbmcoaWRlbnRpZmllcjogU3lzdGVtX1N0cmluZywgLi4uYXJnc0pzb246IFN5c3RlbV9TdHJpbmdbXSkge1xuICBjb25zdCBpZGVudGlmaWVySnNTdHJpbmcgPSBwbGF0Zm9ybS50b0phdmFTY3JpcHRTdHJpbmcoaWRlbnRpZmllcik7XG4gIGNvbnN0IGZ1bmNJbnN0YW5jZSA9IGdldFJlZ2lzdGVyZWRGdW5jdGlvbihpZGVudGlmaWVySnNTdHJpbmcpO1xuICBjb25zdCBhcmdzID0gYXJnc0pzb24ubWFwKGpzb24gPT4gSlNPTi5wYXJzZShwbGF0Zm9ybS50b0phdmFTY3JpcHRTdHJpbmcoanNvbikpKTtcbiAgY29uc3QgcmVzdWx0ID0gZnVuY0luc3RhbmNlLmFwcGx5KG51bGwsIGFyZ3MpO1xuICBpZiAocmVzdWx0ICE9PSBudWxsICYmIHJlc3VsdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgY29uc3QgcmVzdWx0SnNvbiA9IEpTT04uc3RyaW5naWZ5KHJlc3VsdCk7XG4gICAgcmV0dXJuIHBsYXRmb3JtLnRvRG90TmV0U3RyaW5nKHJlc3VsdEpzb24pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvSW50ZXJvcC9JbnZva2VXaXRoSnNvbk1hcnNoYWxsaW5nLnRzIiwiaW1wb3J0IHsgUG9pbnRlciwgU3lzdGVtX0FycmF5IH0gZnJvbSAnLi4vUGxhdGZvcm0vUGxhdGZvcm0nO1xuaW1wb3J0IHsgcGxhdGZvcm0gfSBmcm9tICcuLi9FbnZpcm9ubWVudCc7XG5pbXBvcnQgeyBSZW5kZXJUcmVlRnJhbWVQb2ludGVyIH0gZnJvbSAnLi9SZW5kZXJUcmVlRnJhbWUnO1xuaW1wb3J0IHsgUmVuZGVyVHJlZUVkaXRQb2ludGVyIH0gZnJvbSAnLi9SZW5kZXJUcmVlRWRpdCc7XG5cbi8vIEtlZXAgaW4gc3luYyB3aXRoIHRoZSBzdHJ1Y3RzIGluIC5ORVQgY29kZVxuXG5leHBvcnQgY29uc3QgcmVuZGVyQmF0Y2ggPSB7XG4gIHVwZGF0ZWRDb21wb25lbnRzOiAob2JqOiBSZW5kZXJCYXRjaFBvaW50ZXIpID0+IHBsYXRmb3JtLnJlYWRTdHJ1Y3RGaWVsZDxBcnJheVJhbmdlUG9pbnRlcjxSZW5kZXJUcmVlRGlmZlBvaW50ZXI+PihvYmosIDApLFxuICByZWZlcmVuY2VGcmFtZXM6IChvYmo6IFJlbmRlckJhdGNoUG9pbnRlcikgPT4gcGxhdGZvcm0ucmVhZFN0cnVjdEZpZWxkPEFycmF5UmFuZ2VQb2ludGVyPFJlbmRlclRyZWVGcmFtZVBvaW50ZXI+PihvYmosIGFycmF5UmFuZ2VTdHJ1Y3RMZW5ndGgpLFxuICBkaXNwb3NlZENvbXBvbmVudElkczogKG9iajogUmVuZGVyQmF0Y2hQb2ludGVyKSA9PiBwbGF0Zm9ybS5yZWFkU3RydWN0RmllbGQ8QXJyYXlSYW5nZVBvaW50ZXI8bnVtYmVyPj4ob2JqLCBhcnJheVJhbmdlU3RydWN0TGVuZ3RoICsgYXJyYXlSYW5nZVN0cnVjdExlbmd0aCksXG59O1xuXG5jb25zdCBhcnJheVJhbmdlU3RydWN0TGVuZ3RoID0gODtcbmV4cG9ydCBjb25zdCBhcnJheVJhbmdlID0ge1xuICBhcnJheTogPFQ+KG9iajogQXJyYXlSYW5nZVBvaW50ZXI8VD4pID0+IHBsYXRmb3JtLnJlYWRPYmplY3RGaWVsZDxTeXN0ZW1fQXJyYXk8VD4+KG9iaiwgMCksXG4gIGNvdW50OiA8VD4ob2JqOiBBcnJheVJhbmdlUG9pbnRlcjxUPikgPT4gcGxhdGZvcm0ucmVhZEludDMyRmllbGQob2JqLCA0KSxcbn07XG5cbmNvbnN0IGFycmF5U2VnbWVudFN0cnVjdExlbmd0aCA9IDEyO1xuZXhwb3J0IGNvbnN0IGFycmF5U2VnbWVudCA9IHtcbiAgYXJyYXk6IDxUPihvYmo6IEFycmF5U2VnbWVudFBvaW50ZXI8VD4pID0+IHBsYXRmb3JtLnJlYWRPYmplY3RGaWVsZDxTeXN0ZW1fQXJyYXk8VD4+KG9iaiwgMCksXG4gIG9mZnNldDogPFQ+KG9iajogQXJyYXlTZWdtZW50UG9pbnRlcjxUPikgPT4gcGxhdGZvcm0ucmVhZEludDMyRmllbGQob2JqLCA0KSxcbiAgY291bnQ6IDxUPihvYmo6IEFycmF5U2VnbWVudFBvaW50ZXI8VD4pID0+IHBsYXRmb3JtLnJlYWRJbnQzMkZpZWxkKG9iaiwgOCksXG59O1xuXG5leHBvcnQgY29uc3QgcmVuZGVyVHJlZURpZmZTdHJ1Y3RMZW5ndGggPSA0ICsgYXJyYXlTZWdtZW50U3RydWN0TGVuZ3RoO1xuZXhwb3J0IGNvbnN0IHJlbmRlclRyZWVEaWZmID0ge1xuICBjb21wb25lbnRJZDogKG9iajogUmVuZGVyVHJlZURpZmZQb2ludGVyKSA9PiBwbGF0Zm9ybS5yZWFkSW50MzJGaWVsZChvYmosIDApLFxuICBlZGl0czogKG9iajogUmVuZGVyVHJlZURpZmZQb2ludGVyKSA9PiBwbGF0Zm9ybS5yZWFkU3RydWN0RmllbGQ8QXJyYXlTZWdtZW50UG9pbnRlcjxSZW5kZXJUcmVlRWRpdFBvaW50ZXI+PihvYmosIDQpLCAgXG59O1xuXG4vLyBOb21pbmFsIHR5cGVzIHRvIGVuc3VyZSBvbmx5IHZhbGlkIHBvaW50ZXJzIGFyZSBwYXNzZWQgdG8gdGhlIGZ1bmN0aW9ucyBhYm92ZS5cbi8vIEF0IHJ1bnRpbWUgdGhlIHZhbHVlcyBhcmUganVzdCBudW1iZXJzLlxuZXhwb3J0IGludGVyZmFjZSBSZW5kZXJCYXRjaFBvaW50ZXIgZXh0ZW5kcyBQb2ludGVyIHsgUmVuZGVyQmF0Y2hQb2ludGVyX19ET19OT1RfSU1QTEVNRU5UOiBhbnkgfVxuZXhwb3J0IGludGVyZmFjZSBBcnJheVJhbmdlUG9pbnRlcjxUPiBleHRlbmRzIFBvaW50ZXIgeyBBcnJheVJhbmdlUG9pbnRlcl9fRE9fTk9UX0lNUExFTUVOVDogYW55IH1cbmV4cG9ydCBpbnRlcmZhY2UgQXJyYXlTZWdtZW50UG9pbnRlcjxUPiBleHRlbmRzIFBvaW50ZXIgeyBBcnJheVNlZ21lbnRQb2ludGVyX19ET19OT1RfSU1QTEVNRU5UOiBhbnkgfVxuZXhwb3J0IGludGVyZmFjZSBSZW5kZXJUcmVlRGlmZlBvaW50ZXIgZXh0ZW5kcyBQb2ludGVyIHsgUmVuZGVyVHJlZURpZmZQb2ludGVyX19ET19OT1RfSU1QTEVNRU5UOiBhbnkgfVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1JlbmRlcmluZy9SZW5kZXJCYXRjaC50cyIsImltcG9ydCB7IFN5c3RlbV9BcnJheSwgTWV0aG9kSGFuZGxlIH0gZnJvbSAnLi4vUGxhdGZvcm0vUGxhdGZvcm0nO1xuaW1wb3J0IHsgZ2V0UmVuZGVyVHJlZUVkaXRQdHIsIHJlbmRlclRyZWVFZGl0LCBSZW5kZXJUcmVlRWRpdFBvaW50ZXIsIEVkaXRUeXBlIH0gZnJvbSAnLi9SZW5kZXJUcmVlRWRpdCc7XG5pbXBvcnQgeyBnZXRUcmVlRnJhbWVQdHIsIHJlbmRlclRyZWVGcmFtZSwgRnJhbWVUeXBlLCBSZW5kZXJUcmVlRnJhbWVQb2ludGVyIH0gZnJvbSAnLi9SZW5kZXJUcmVlRnJhbWUnO1xuaW1wb3J0IHsgcGxhdGZvcm0gfSBmcm9tICcuLi9FbnZpcm9ubWVudCc7XG5sZXQgcmFpc2VFdmVudE1ldGhvZDogTWV0aG9kSGFuZGxlO1xubGV0IHJlbmRlckNvbXBvbmVudE1ldGhvZDogTWV0aG9kSGFuZGxlO1xuXG5leHBvcnQgY2xhc3MgQnJvd3NlclJlbmRlcmVyIHtcbiAgcHJpdmF0ZSBjaGlsZENvbXBvbmVudExvY2F0aW9uczogeyBbY29tcG9uZW50SWQ6IG51bWJlcl06IEVsZW1lbnQgfSA9IHt9O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgYnJvd3NlclJlbmRlcmVySWQ6IG51bWJlcikge1xuICB9XG5cbiAgcHVibGljIGF0dGFjaENvbXBvbmVudFRvRWxlbWVudChjb21wb25lbnRJZDogbnVtYmVyLCBlbGVtZW50OiBFbGVtZW50KSB7XG4gICAgdGhpcy5jaGlsZENvbXBvbmVudExvY2F0aW9uc1tjb21wb25lbnRJZF0gPSBlbGVtZW50O1xuICB9XG5cbiAgcHVibGljIHVwZGF0ZUNvbXBvbmVudChjb21wb25lbnRJZDogbnVtYmVyLCBlZGl0czogU3lzdGVtX0FycmF5PFJlbmRlclRyZWVFZGl0UG9pbnRlcj4sIGVkaXRzT2Zmc2V0OiBudW1iZXIsIGVkaXRzTGVuZ3RoOiBudW1iZXIsIHJlZmVyZW5jZUZyYW1lczogU3lzdGVtX0FycmF5PFJlbmRlclRyZWVGcmFtZVBvaW50ZXI+KSB7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuY2hpbGRDb21wb25lbnRMb2NhdGlvbnNbY29tcG9uZW50SWRdO1xuICAgIGlmICghZWxlbWVudCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyBlbGVtZW50IGlzIGN1cnJlbnRseSBhc3NvY2lhdGVkIHdpdGggY29tcG9uZW50ICR7Y29tcG9uZW50SWR9YCk7XG4gICAgfVxuXG4gICAgdGhpcy5hcHBseUVkaXRzKGNvbXBvbmVudElkLCBlbGVtZW50LCAwLCBlZGl0cywgZWRpdHNPZmZzZXQsIGVkaXRzTGVuZ3RoLCByZWZlcmVuY2VGcmFtZXMpO1xuICB9XG5cbiAgcHVibGljIGRpc3Bvc2VDb21wb25lbnQoY29tcG9uZW50SWQ6IG51bWJlcikge1xuICAgIGRlbGV0ZSB0aGlzLmNoaWxkQ29tcG9uZW50TG9jYXRpb25zW2NvbXBvbmVudElkXTtcbiAgfVxuXG4gIGFwcGx5RWRpdHMoY29tcG9uZW50SWQ6IG51bWJlciwgcGFyZW50OiBFbGVtZW50LCBjaGlsZEluZGV4OiBudW1iZXIsIGVkaXRzOiBTeXN0ZW1fQXJyYXk8UmVuZGVyVHJlZUVkaXRQb2ludGVyPiwgZWRpdHNPZmZzZXQ6IG51bWJlciwgZWRpdHNMZW5ndGg6IG51bWJlciwgcmVmZXJlbmNlRnJhbWVzOiBTeXN0ZW1fQXJyYXk8UmVuZGVyVHJlZUZyYW1lUG9pbnRlcj4pIHtcbiAgICBsZXQgY3VycmVudERlcHRoID0gMDtcbiAgICBsZXQgY2hpbGRJbmRleEF0Q3VycmVudERlcHRoID0gY2hpbGRJbmRleDtcbiAgICBjb25zdCBtYXhFZGl0SW5kZXhFeGNsID0gZWRpdHNPZmZzZXQgKyBlZGl0c0xlbmd0aDtcbiAgICBmb3IgKGxldCBlZGl0SW5kZXggPSBlZGl0c09mZnNldDsgZWRpdEluZGV4IDwgbWF4RWRpdEluZGV4RXhjbDsgZWRpdEluZGV4KyspIHtcbiAgICAgIGNvbnN0IGVkaXQgPSBnZXRSZW5kZXJUcmVlRWRpdFB0cihlZGl0cywgZWRpdEluZGV4KTtcbiAgICAgIGNvbnN0IGVkaXRUeXBlID0gcmVuZGVyVHJlZUVkaXQudHlwZShlZGl0KTtcbiAgICAgIHN3aXRjaCAoZWRpdFR5cGUpIHtcbiAgICAgICAgY2FzZSBFZGl0VHlwZS5wcmVwZW5kRnJhbWU6IHtcbiAgICAgICAgICBjb25zdCBmcmFtZUluZGV4ID0gcmVuZGVyVHJlZUVkaXQubmV3VHJlZUluZGV4KGVkaXQpO1xuICAgICAgICAgIGNvbnN0IGZyYW1lID0gZ2V0VHJlZUZyYW1lUHRyKHJlZmVyZW5jZUZyYW1lcywgZnJhbWVJbmRleCk7XG4gICAgICAgICAgY29uc3Qgc2libGluZ0luZGV4ID0gcmVuZGVyVHJlZUVkaXQuc2libGluZ0luZGV4KGVkaXQpO1xuICAgICAgICAgIHRoaXMuaW5zZXJ0RnJhbWUoY29tcG9uZW50SWQsIHBhcmVudCwgY2hpbGRJbmRleEF0Q3VycmVudERlcHRoICsgc2libGluZ0luZGV4LCByZWZlcmVuY2VGcmFtZXMsIGZyYW1lLCBmcmFtZUluZGV4KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBjYXNlIEVkaXRUeXBlLnJlbW92ZUZyYW1lOiB7XG4gICAgICAgICAgY29uc3Qgc2libGluZ0luZGV4ID0gcmVuZGVyVHJlZUVkaXQuc2libGluZ0luZGV4KGVkaXQpO1xuICAgICAgICAgIHJlbW92ZU5vZGVGcm9tRE9NKHBhcmVudCwgY2hpbGRJbmRleEF0Q3VycmVudERlcHRoICsgc2libGluZ0luZGV4KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBjYXNlIEVkaXRUeXBlLnNldEF0dHJpYnV0ZToge1xuICAgICAgICAgIGNvbnN0IGZyYW1lSW5kZXggPSByZW5kZXJUcmVlRWRpdC5uZXdUcmVlSW5kZXgoZWRpdCk7XG4gICAgICAgICAgY29uc3QgZnJhbWUgPSBnZXRUcmVlRnJhbWVQdHIocmVmZXJlbmNlRnJhbWVzLCBmcmFtZUluZGV4KTtcbiAgICAgICAgICBjb25zdCBzaWJsaW5nSW5kZXggPSByZW5kZXJUcmVlRWRpdC5zaWJsaW5nSW5kZXgoZWRpdCk7XG4gICAgICAgICAgY29uc3QgZWxlbWVudCA9IHBhcmVudC5jaGlsZE5vZGVzW2NoaWxkSW5kZXhBdEN1cnJlbnREZXB0aCArIHNpYmxpbmdJbmRleF0gYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgICAgdGhpcy5hcHBseUF0dHJpYnV0ZShjb21wb25lbnRJZCwgZWxlbWVudCwgZnJhbWUpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgRWRpdFR5cGUucmVtb3ZlQXR0cmlidXRlOiB7XG4gICAgICAgICAgY29uc3Qgc2libGluZ0luZGV4ID0gcmVuZGVyVHJlZUVkaXQuc2libGluZ0luZGV4KGVkaXQpO1xuICAgICAgICAgIHJlbW92ZUF0dHJpYnV0ZUZyb21ET00ocGFyZW50LCBjaGlsZEluZGV4QXRDdXJyZW50RGVwdGggKyBzaWJsaW5nSW5kZXgsIHJlbmRlclRyZWVFZGl0LnJlbW92ZWRBdHRyaWJ1dGVOYW1lKGVkaXQpISk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSBFZGl0VHlwZS51cGRhdGVUZXh0OiB7XG4gICAgICAgICAgY29uc3QgZnJhbWVJbmRleCA9IHJlbmRlclRyZWVFZGl0Lm5ld1RyZWVJbmRleChlZGl0KTtcbiAgICAgICAgICBjb25zdCBmcmFtZSA9IGdldFRyZWVGcmFtZVB0cihyZWZlcmVuY2VGcmFtZXMsIGZyYW1lSW5kZXgpO1xuICAgICAgICAgIGNvbnN0IHNpYmxpbmdJbmRleCA9IHJlbmRlclRyZWVFZGl0LnNpYmxpbmdJbmRleChlZGl0KTtcbiAgICAgICAgICBjb25zdCBkb21UZXh0Tm9kZSA9IHBhcmVudC5jaGlsZE5vZGVzW2NoaWxkSW5kZXhBdEN1cnJlbnREZXB0aCArIHNpYmxpbmdJbmRleF0gYXMgVGV4dDtcbiAgICAgICAgICBkb21UZXh0Tm9kZS50ZXh0Q29udGVudCA9IHJlbmRlclRyZWVGcmFtZS50ZXh0Q29udGVudChmcmFtZSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSBFZGl0VHlwZS5zdGVwSW46IHtcbiAgICAgICAgICBjb25zdCBzaWJsaW5nSW5kZXggPSByZW5kZXJUcmVlRWRpdC5zaWJsaW5nSW5kZXgoZWRpdCk7XG4gICAgICAgICAgcGFyZW50ID0gcGFyZW50LmNoaWxkTm9kZXNbY2hpbGRJbmRleEF0Q3VycmVudERlcHRoICsgc2libGluZ0luZGV4XSBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgICBjdXJyZW50RGVwdGgrKztcbiAgICAgICAgICBjaGlsZEluZGV4QXRDdXJyZW50RGVwdGggPSAwO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgRWRpdFR5cGUuc3RlcE91dDoge1xuICAgICAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnRFbGVtZW50ITtcbiAgICAgICAgICBjdXJyZW50RGVwdGgtLTtcbiAgICAgICAgICBjaGlsZEluZGV4QXRDdXJyZW50RGVwdGggPSBjdXJyZW50RGVwdGggPT09IDAgPyBjaGlsZEluZGV4IDogMDsgLy8gVGhlIGNoaWxkSW5kZXggaXMgb25seSBldmVyIG5vbnplcm8gYXQgemVybyBkZXB0aFxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICBjb25zdCB1bmtub3duVHlwZTogbmV2ZXIgPSBlZGl0VHlwZTsgLy8gQ29tcGlsZS10aW1lIHZlcmlmaWNhdGlvbiB0aGF0IHRoZSBzd2l0Y2ggd2FzIGV4aGF1c3RpdmVcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gZWRpdCB0eXBlOiAke3Vua25vd25UeXBlfWApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaW5zZXJ0RnJhbWUoY29tcG9uZW50SWQ6IG51bWJlciwgcGFyZW50OiBFbGVtZW50LCBjaGlsZEluZGV4OiBudW1iZXIsIGZyYW1lczogU3lzdGVtX0FycmF5PFJlbmRlclRyZWVGcmFtZVBvaW50ZXI+LCBmcmFtZTogUmVuZGVyVHJlZUZyYW1lUG9pbnRlciwgZnJhbWVJbmRleDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICBjb25zdCBmcmFtZVR5cGUgPSByZW5kZXJUcmVlRnJhbWUuZnJhbWVUeXBlKGZyYW1lKTtcbiAgICBzd2l0Y2ggKGZyYW1lVHlwZSkge1xuICAgICAgY2FzZSBGcmFtZVR5cGUuZWxlbWVudDpcbiAgICAgICAgdGhpcy5pbnNlcnRFbGVtZW50KGNvbXBvbmVudElkLCBwYXJlbnQsIGNoaWxkSW5kZXgsIGZyYW1lcywgZnJhbWUsIGZyYW1lSW5kZXgpO1xuICAgICAgICByZXR1cm4gMTtcbiAgICAgIGNhc2UgRnJhbWVUeXBlLnRleHQ6XG4gICAgICAgIHRoaXMuaW5zZXJ0VGV4dChwYXJlbnQsIGNoaWxkSW5kZXgsIGZyYW1lKTtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgICBjYXNlIEZyYW1lVHlwZS5hdHRyaWJ1dGU6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQXR0cmlidXRlIGZyYW1lcyBzaG91bGQgb25seSBiZSBwcmVzZW50IGFzIGxlYWRpbmcgY2hpbGRyZW4gb2YgZWxlbWVudCBmcmFtZXMuJyk7XG4gICAgICBjYXNlIEZyYW1lVHlwZS5jb21wb25lbnQ6XG4gICAgICAgIHRoaXMuaW5zZXJ0Q29tcG9uZW50KHBhcmVudCwgY2hpbGRJbmRleCwgZnJhbWUpO1xuICAgICAgICByZXR1cm4gMTtcbiAgICAgIGNhc2UgRnJhbWVUeXBlLnJlZ2lvbjpcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zZXJ0RnJhbWVSYW5nZShjb21wb25lbnRJZCwgcGFyZW50LCBjaGlsZEluZGV4LCBmcmFtZXMsIGZyYW1lSW5kZXggKyAxLCBmcmFtZUluZGV4ICsgcmVuZGVyVHJlZUZyYW1lLnN1YnRyZWVMZW5ndGgoZnJhbWUpKTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGNvbnN0IHVua25vd25UeXBlOiBuZXZlciA9IGZyYW1lVHlwZTsgLy8gQ29tcGlsZS10aW1lIHZlcmlmaWNhdGlvbiB0aGF0IHRoZSBzd2l0Y2ggd2FzIGV4aGF1c3RpdmVcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIGZyYW1lIHR5cGU6ICR7dW5rbm93blR5cGV9YCk7XG4gICAgfVxuICB9XG5cbiAgaW5zZXJ0RWxlbWVudChjb21wb25lbnRJZDogbnVtYmVyLCBwYXJlbnQ6IEVsZW1lbnQsIGNoaWxkSW5kZXg6IG51bWJlciwgZnJhbWVzOiBTeXN0ZW1fQXJyYXk8UmVuZGVyVHJlZUZyYW1lUG9pbnRlcj4sIGZyYW1lOiBSZW5kZXJUcmVlRnJhbWVQb2ludGVyLCBmcmFtZUluZGV4OiBudW1iZXIpIHtcbiAgICBjb25zdCB0YWdOYW1lID0gcmVuZGVyVHJlZUZyYW1lLmVsZW1lbnROYW1lKGZyYW1lKSE7XG4gICAgY29uc3QgbmV3RG9tRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnTmFtZSk7XG4gICAgaW5zZXJ0Tm9kZUludG9ET00obmV3RG9tRWxlbWVudCwgcGFyZW50LCBjaGlsZEluZGV4KTtcblxuICAgIC8vIEFwcGx5IGF0dHJpYnV0ZXNcbiAgICBjb25zdCBkZXNjZW5kYW50c0VuZEluZGV4RXhjbCA9IGZyYW1lSW5kZXggKyByZW5kZXJUcmVlRnJhbWUuc3VidHJlZUxlbmd0aChmcmFtZSk7XG4gICAgZm9yIChsZXQgZGVzY2VuZGFudEluZGV4ID0gZnJhbWVJbmRleCArIDE7IGRlc2NlbmRhbnRJbmRleCA8IGRlc2NlbmRhbnRzRW5kSW5kZXhFeGNsOyBkZXNjZW5kYW50SW5kZXgrKykge1xuICAgICAgY29uc3QgZGVzY2VuZGFudEZyYW1lID0gZ2V0VHJlZUZyYW1lUHRyKGZyYW1lcywgZGVzY2VuZGFudEluZGV4KTtcbiAgICAgIGlmIChyZW5kZXJUcmVlRnJhbWUuZnJhbWVUeXBlKGRlc2NlbmRhbnRGcmFtZSkgPT09IEZyYW1lVHlwZS5hdHRyaWJ1dGUpIHtcbiAgICAgICAgdGhpcy5hcHBseUF0dHJpYnV0ZShjb21wb25lbnRJZCwgbmV3RG9tRWxlbWVudCwgZGVzY2VuZGFudEZyYW1lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEFzIHNvb24gYXMgd2Ugc2VlIGEgbm9uLWF0dHJpYnV0ZSBjaGlsZCwgYWxsIHRoZSBzdWJzZXF1ZW50IGNoaWxkIGZyYW1lcyBhcmVcbiAgICAgICAgLy8gbm90IGF0dHJpYnV0ZXMsIHNvIGJhaWwgb3V0IGFuZCBpbnNlcnQgdGhlIHJlbW5hbnRzIHJlY3Vyc2l2ZWx5XG4gICAgICAgIHRoaXMuaW5zZXJ0RnJhbWVSYW5nZShjb21wb25lbnRJZCwgbmV3RG9tRWxlbWVudCwgMCwgZnJhbWVzLCBkZXNjZW5kYW50SW5kZXgsIGRlc2NlbmRhbnRzRW5kSW5kZXhFeGNsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaW5zZXJ0Q29tcG9uZW50KHBhcmVudDogRWxlbWVudCwgY2hpbGRJbmRleDogbnVtYmVyLCBmcmFtZTogUmVuZGVyVHJlZUZyYW1lUG9pbnRlcikge1xuICAgIC8vIEN1cnJlbnRseSwgdG8gc3VwcG9ydCBPKDEpIGxvb2t1cHMgZnJvbSByZW5kZXIgdHJlZSBmcmFtZXMgdG8gRE9NIG5vZGVzLCB3ZSByZWx5IG9uXG4gICAgLy8gZWFjaCBjaGlsZCBjb21wb25lbnQgZXhpc3RpbmcgYXMgYSBzaW5nbGUgdG9wLWxldmVsIGVsZW1lbnQgaW4gdGhlIERPTS4gVG8gZ3VhcmFudGVlXG4gICAgLy8gdGhhdCwgd2Ugd3JhcCBjaGlsZCBjb21wb25lbnRzIGluIHRoZXNlICdibGF6b3ItY29tcG9uZW50JyB3cmFwcGVycy5cbiAgICAvLyBUbyBpbXByb3ZlIG9uIHRoaXMgaW4gdGhlIGZ1dHVyZTpcbiAgICAvLyAtIElmIHdlIGNhbiBzdGF0aWNhbGx5IGRldGVjdCB0aGF0IGEgZ2l2ZW4gY29tcG9uZW50IGFsd2F5cyBwcm9kdWNlcyBhIHNpbmdsZSB0b3AtbGV2ZWxcbiAgICAvLyAgIGVsZW1lbnQgYW55d2F5LCB0aGVuIGRvbid0IHdyYXAgaXQgaW4gYSBmdXJ0aGVyIG5vbnN0YW5kYXJkIGVsZW1lbnRcbiAgICAvLyAtIElmIHdlIHJlYWxseSB3YW50IHRvIHN1cHBvcnQgY2hpbGQgY29tcG9uZW50cyBwcm9kdWNpbmcgbXVsdGlwbGUgdG9wLWxldmVsIGZyYW1lcyBhbmRcbiAgICAvLyAgIG5vdCBiZWluZyB3cmFwcGVkIGluIGEgY29udGFpbmVyIGF0IGFsbCwgdGhlbiBldmVyeSB0aW1lIGEgY29tcG9uZW50IGlzIHJlZnJlc2hlZCBpblxuICAgIC8vICAgdGhlIERPTSwgd2UgY291bGQgdXBkYXRlIGFuIGFycmF5IG9uIHRoZSBwYXJlbnQgZWxlbWVudCB0aGF0IHNwZWNpZmllcyBob3cgbWFueSBET01cbiAgICAvLyAgIG5vZGVzIGNvcnJlc3BvbmQgdG8gZWFjaCBvZiBpdHMgcmVuZGVyIHRyZWUgZnJhbWVzLiBUaGVuIHdoZW4gdGhhdCBwYXJlbnQgd2FudHMgdG9cbiAgICAvLyAgIGxvY2F0ZSB0aGUgZmlyc3QgRE9NIG5vZGUgZm9yIGEgcmVuZGVyIHRyZWUgZnJhbWUsIGl0IGNhbiBzdW0gYWxsIHRoZSBmcmFtZSBjb3VudHMgZm9yXG4gICAgLy8gICBhbGwgdGhlIHByZWNlZGluZyByZW5kZXIgdHJlZXMgZnJhbWVzLiBJdCdzIE8oTiksIGJ1dCB3aGVyZSBOIGlzIHRoZSBudW1iZXIgb2Ygc2libGluZ3NcbiAgICAvLyAgIChjb3VudGluZyBjaGlsZCBjb21wb25lbnRzIGFzIGEgc2luZ2xlIGl0ZW0pLCBzbyBOIHdpbGwgcmFyZWx5IGlmIGV2ZXIgYmUgbGFyZ2UuXG4gICAgLy8gICBXZSBjb3VsZCBldmVuIGtlZXAgdHJhY2sgb2Ygd2hldGhlciBhbGwgdGhlIGNoaWxkIGNvbXBvbmVudHMgaGFwcGVuIHRvIGhhdmUgZXhhY3RseSAxXG4gICAgLy8gICB0b3AgbGV2ZWwgZnJhbWVzLCBhbmQgaW4gdGhhdCBjYXNlLCB0aGVyZSdzIG5vIG5lZWQgdG8gc3VtIGFzIHdlIGNhbiBkbyBkaXJlY3QgbG9va3Vwcy5cbiAgICBjb25zdCBjb250YWluZXJFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYmxhem9yLWNvbXBvbmVudCcpO1xuICAgIGluc2VydE5vZGVJbnRvRE9NKGNvbnRhaW5lckVsZW1lbnQsIHBhcmVudCwgY2hpbGRJbmRleCk7XG5cbiAgICAvLyBBbGwgd2UgaGF2ZSB0byBkbyBpcyBhc3NvY2lhdGUgdGhlIGNoaWxkIGNvbXBvbmVudCBJRCB3aXRoIGl0cyBsb2NhdGlvbi4gV2UgZG9uJ3QgYWN0dWFsbHlcbiAgICAvLyBkbyBhbnkgcmVuZGVyaW5nIGhlcmUsIGJlY2F1c2UgdGhlIGRpZmYgZm9yIHRoZSBjaGlsZCB3aWxsIGFwcGVhciBsYXRlciBpbiB0aGUgcmVuZGVyIGJhdGNoLlxuICAgIGNvbnN0IGNoaWxkQ29tcG9uZW50SWQgPSByZW5kZXJUcmVlRnJhbWUuY29tcG9uZW50SWQoZnJhbWUpO1xuICAgIHRoaXMuYXR0YWNoQ29tcG9uZW50VG9FbGVtZW50KGNoaWxkQ29tcG9uZW50SWQsIGNvbnRhaW5lckVsZW1lbnQpO1xuICB9XG5cbiAgaW5zZXJ0VGV4dChwYXJlbnQ6IEVsZW1lbnQsIGNoaWxkSW5kZXg6IG51bWJlciwgdGV4dEZyYW1lOiBSZW5kZXJUcmVlRnJhbWVQb2ludGVyKSB7XG4gICAgY29uc3QgdGV4dENvbnRlbnQgPSByZW5kZXJUcmVlRnJhbWUudGV4dENvbnRlbnQodGV4dEZyYW1lKSE7XG4gICAgY29uc3QgbmV3RG9tVGV4dE5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0ZXh0Q29udGVudCk7XG4gICAgaW5zZXJ0Tm9kZUludG9ET00obmV3RG9tVGV4dE5vZGUsIHBhcmVudCwgY2hpbGRJbmRleCk7XG4gIH1cblxuICBhcHBseUF0dHJpYnV0ZShjb21wb25lbnRJZDogbnVtYmVyLCB0b0RvbUVsZW1lbnQ6IEVsZW1lbnQsIGF0dHJpYnV0ZUZyYW1lOiBSZW5kZXJUcmVlRnJhbWVQb2ludGVyKSB7XG4gICAgY29uc3QgYXR0cmlidXRlTmFtZSA9IHJlbmRlclRyZWVGcmFtZS5hdHRyaWJ1dGVOYW1lKGF0dHJpYnV0ZUZyYW1lKSE7XG4gICAgY29uc3QgYnJvd3NlclJlbmRlcmVySWQgPSB0aGlzLmJyb3dzZXJSZW5kZXJlcklkO1xuICAgIGNvbnN0IGV2ZW50SGFuZGxlcklkID0gcmVuZGVyVHJlZUZyYW1lLmF0dHJpYnV0ZUV2ZW50SGFuZGxlcklkKGF0dHJpYnV0ZUZyYW1lKTtcblxuICAgIGlmIChhdHRyaWJ1dGVOYW1lID09PSAndmFsdWUnKSB7XG4gICAgICBpZiAodGhpcy50cnlBcHBseVZhbHVlUHJvcGVydHkodG9Eb21FbGVtZW50LCByZW5kZXJUcmVlRnJhbWUuYXR0cmlidXRlVmFsdWUoYXR0cmlidXRlRnJhbWUpKSkge1xuICAgICAgICByZXR1cm47IC8vIElmIHRoaXMgRE9NIGVsZW1lbnQgdHlwZSBoYXMgc3BlY2lhbCAndmFsdWUnIGhhbmRsaW5nLCBkb24ndCBhbHNvIHdyaXRlIGl0IGFzIGFuIGF0dHJpYnV0ZVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRPRE86IEluc3RlYWQgb2YgYXBwbHlpbmcgc2VwYXJhdGUgZXZlbnQgbGlzdGVuZXJzIHRvIGVhY2ggRE9NIGVsZW1lbnQsIHVzZSBldmVudCBkZWxlZ2F0aW9uXG4gICAgLy8gYW5kIHJlbW92ZSBhbGwgdGhlIF9ibGF6b3IqTGlzdGVuZXIgaGFja3NcbiAgICBzd2l0Y2ggKGF0dHJpYnV0ZU5hbWUpIHtcbiAgICAgIGNhc2UgJ29uY2xpY2snOiB7XG4gICAgICAgIHRvRG9tRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRvRG9tRWxlbWVudFsnX2JsYXpvckNsaWNrTGlzdGVuZXInXSk7XG4gICAgICAgIGNvbnN0IGxpc3RlbmVyID0gZXZ0ID0+IHJhaXNlRXZlbnQoZXZ0LCBicm93c2VyUmVuZGVyZXJJZCwgY29tcG9uZW50SWQsIGV2ZW50SGFuZGxlcklkLCAnbW91c2UnLCB7IFR5cGU6ICdjbGljaycgfSk7XG4gICAgICAgIHRvRG9tRWxlbWVudFsnX2JsYXpvckNsaWNrTGlzdGVuZXInXSA9IGxpc3RlbmVyO1xuICAgICAgICB0b0RvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBsaXN0ZW5lcik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSAnb25jaGFuZ2UnOiB7XG4gICAgICAgIHRvRG9tRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB0b0RvbUVsZW1lbnRbJ19ibGF6b3JDaGFuZ2VMaXN0ZW5lciddKTtcbiAgICAgICAgY29uc3QgdGFyZ2V0SXNDaGVja2JveCA9IGlzQ2hlY2tib3godG9Eb21FbGVtZW50KTtcbiAgICAgICAgY29uc3QgbGlzdGVuZXIgPSBldnQgPT4ge1xuICAgICAgICAgIGNvbnN0IG5ld1ZhbHVlID0gdGFyZ2V0SXNDaGVja2JveCA/IGV2dC50YXJnZXQuY2hlY2tlZCA6IGV2dC50YXJnZXQudmFsdWU7XG4gICAgICAgICAgcmFpc2VFdmVudChldnQsIGJyb3dzZXJSZW5kZXJlcklkLCBjb21wb25lbnRJZCwgZXZlbnRIYW5kbGVySWQsICdjaGFuZ2UnLCB7IFR5cGU6ICdjaGFuZ2UnLCBWYWx1ZTogbmV3VmFsdWUgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHRvRG9tRWxlbWVudFsnX2JsYXpvckNoYW5nZUxpc3RlbmVyJ10gPSBsaXN0ZW5lcjtcbiAgICAgICAgdG9Eb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGxpc3RlbmVyKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlICdvbmtleXByZXNzJzoge1xuICAgICAgICB0b0RvbUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5cHJlc3MnLCB0b0RvbUVsZW1lbnRbJ19ibGF6b3JLZXlwcmVzc0xpc3RlbmVyJ10pO1xuICAgICAgICBjb25zdCBsaXN0ZW5lciA9IGV2dCA9PiB7XG4gICAgICAgICAgLy8gVGhpcyBkb2VzIG5vdCBhY2NvdW50IGZvciBzcGVjaWFsIGtleXMgbm9yIGNyb3NzLWJyb3dzZXIgZGlmZmVyZW5jZXMuIFNvIGZhciBpdCdzXG4gICAgICAgICAgLy8ganVzdCB0byBlc3RhYmxpc2ggdGhhdCB3ZSBjYW4gcGFzcyBwYXJhbWV0ZXJzIHdoZW4gcmFpc2luZyBldmVudHMuXG4gICAgICAgICAgLy8gV2UgdXNlIEMjLXN0eWxlIFBhc2NhbENhc2Ugb24gdGhlIGV2ZW50SW5mbyB0byBzaW1wbGlmeSBkZXNlcmlhbGl6YXRpb24sIGJ1dCB0aGlzIGNvdWxkXG4gICAgICAgICAgLy8gY2hhbmdlIGlmIHdlIGludHJvZHVjZWQgYSByaWNoZXIgSlNPTiBsaWJyYXJ5IG9uIHRoZSAuTkVUIHNpZGUuXG4gICAgICAgICAgcmFpc2VFdmVudChldnQsIGJyb3dzZXJSZW5kZXJlcklkLCBjb21wb25lbnRJZCwgZXZlbnRIYW5kbGVySWQsICdrZXlib2FyZCcsIHsgVHlwZTogZXZ0LnR5cGUsIEtleTogKGV2dCBhcyBhbnkpLmtleSB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgdG9Eb21FbGVtZW50WydfYmxhem9yS2V5cHJlc3NMaXN0ZW5lciddID0gbGlzdGVuZXI7XG4gICAgICAgIHRvRG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlwcmVzcycsIGxpc3RlbmVyKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBkZWZhdWx0OlxuICAgICAgICAvLyBUcmVhdCBhcyBhIHJlZ3VsYXIgc3RyaW5nLXZhbHVlZCBhdHRyaWJ1dGVcbiAgICAgICAgdG9Eb21FbGVtZW50LnNldEF0dHJpYnV0ZShcbiAgICAgICAgICBhdHRyaWJ1dGVOYW1lLFxuICAgICAgICAgIHJlbmRlclRyZWVGcmFtZS5hdHRyaWJ1dGVWYWx1ZShhdHRyaWJ1dGVGcmFtZSkhXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHRyeUFwcGx5VmFsdWVQcm9wZXJ0eShlbGVtZW50OiBFbGVtZW50LCB2YWx1ZTogc3RyaW5nIHwgbnVsbCkge1xuICAgIC8vIENlcnRhaW4gZWxlbWVudHMgaGF2ZSBidWlsdC1pbiBiZWhhdmlvdXIgZm9yIHRoZWlyICd2YWx1ZScgcHJvcGVydHlcbiAgICBzd2l0Y2ggKGVsZW1lbnQudGFnTmFtZSkge1xuICAgICAgY2FzZSAnSU5QVVQnOlxuICAgICAgY2FzZSAnU0VMRUNUJzpcbiAgICAgICAgaWYgKGlzQ2hlY2tib3goZWxlbWVudCkpIHtcbiAgICAgICAgICAoZWxlbWVudCBhcyBIVE1MSW5wdXRFbGVtZW50KS5jaGVja2VkID0gdmFsdWUgPT09ICdUcnVlJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBOb3RlOiB0aGlzIGRvZW4ndCBoYW5kbGUgPHNlbGVjdD4gY29ycmVjdGx5OiBodHRwczovL2dpdGh1Yi5jb20vYXNwbmV0L0JsYXpvci9pc3N1ZXMvMTU3XG4gICAgICAgICAgKGVsZW1lbnQgYXMgYW55KS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGluc2VydEZyYW1lUmFuZ2UoY29tcG9uZW50SWQ6IG51bWJlciwgcGFyZW50OiBFbGVtZW50LCBjaGlsZEluZGV4OiBudW1iZXIsIGZyYW1lczogU3lzdGVtX0FycmF5PFJlbmRlclRyZWVGcmFtZVBvaW50ZXI+LCBzdGFydEluZGV4OiBudW1iZXIsIGVuZEluZGV4RXhjbDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICBjb25zdCBvcmlnQ2hpbGRJbmRleCA9IGNoaWxkSW5kZXg7XG4gICAgZm9yIChsZXQgaW5kZXggPSBzdGFydEluZGV4OyBpbmRleCA8IGVuZEluZGV4RXhjbDsgaW5kZXgrKykge1xuICAgICAgY29uc3QgZnJhbWUgPSBnZXRUcmVlRnJhbWVQdHIoZnJhbWVzLCBpbmRleCk7XG4gICAgICBjb25zdCBudW1DaGlsZHJlbkluc2VydGVkID0gdGhpcy5pbnNlcnRGcmFtZShjb21wb25lbnRJZCwgcGFyZW50LCBjaGlsZEluZGV4LCBmcmFtZXMsIGZyYW1lLCBpbmRleCk7XG4gICAgICBjaGlsZEluZGV4ICs9IG51bUNoaWxkcmVuSW5zZXJ0ZWQ7XG5cbiAgICAgIC8vIFNraXAgb3ZlciBhbnkgZGVzY2VuZGFudHMsIHNpbmNlIHRoZXkgYXJlIGFscmVhZHkgZGVhbHQgd2l0aCByZWN1cnNpdmVseVxuICAgICAgY29uc3Qgc3VidHJlZUxlbmd0aCA9IHJlbmRlclRyZWVGcmFtZS5zdWJ0cmVlTGVuZ3RoKGZyYW1lKTtcbiAgICAgIGlmIChzdWJ0cmVlTGVuZ3RoID4gMSkge1xuICAgICAgICBpbmRleCArPSBzdWJ0cmVlTGVuZ3RoIC0gMTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gKGNoaWxkSW5kZXggLSBvcmlnQ2hpbGRJbmRleCk7IC8vIFRvdGFsIG51bWJlciBvZiBjaGlsZHJlbiBpbnNlcnRlZFxuICB9XG59XG5cbmZ1bmN0aW9uIGlzQ2hlY2tib3goZWxlbWVudDogRWxlbWVudCkge1xuICByZXR1cm4gZWxlbWVudC50YWdOYW1lID09PSAnSU5QVVQnICYmIGVsZW1lbnQuZ2V0QXR0cmlidXRlKCd0eXBlJykgPT09ICdjaGVja2JveCc7XG59XG5cbmZ1bmN0aW9uIGluc2VydE5vZGVJbnRvRE9NKG5vZGU6IE5vZGUsIHBhcmVudDogRWxlbWVudCwgY2hpbGRJbmRleDogbnVtYmVyKSB7XG4gIGlmIChjaGlsZEluZGV4ID49IHBhcmVudC5jaGlsZE5vZGVzLmxlbmd0aCkge1xuICAgIHBhcmVudC5hcHBlbmRDaGlsZChub2RlKTtcbiAgfSBlbHNlIHtcbiAgICBwYXJlbnQuaW5zZXJ0QmVmb3JlKG5vZGUsIHBhcmVudC5jaGlsZE5vZGVzW2NoaWxkSW5kZXhdKTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZW1vdmVOb2RlRnJvbURPTShwYXJlbnQ6IEVsZW1lbnQsIGNoaWxkSW5kZXg6IG51bWJlcikge1xuICBwYXJlbnQucmVtb3ZlQ2hpbGQocGFyZW50LmNoaWxkTm9kZXNbY2hpbGRJbmRleF0pO1xufVxuXG5mdW5jdGlvbiByZW1vdmVBdHRyaWJ1dGVGcm9tRE9NKHBhcmVudDogRWxlbWVudCwgY2hpbGRJbmRleDogbnVtYmVyLCBhdHRyaWJ1dGVOYW1lOiBzdHJpbmcpIHtcbiAgY29uc3QgZWxlbWVudCA9IHBhcmVudC5jaGlsZE5vZGVzW2NoaWxkSW5kZXhdIGFzIEVsZW1lbnQ7XG4gIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKGF0dHJpYnV0ZU5hbWUpO1xufVxuXG5mdW5jdGlvbiByYWlzZUV2ZW50KGV2ZW50OiBFdmVudCwgYnJvd3NlclJlbmRlcmVySWQ6IG51bWJlciwgY29tcG9uZW50SWQ6IG51bWJlciwgZXZlbnRIYW5kbGVySWQ6IG51bWJlciwgZXZlbnRJbmZvVHlwZTogRXZlbnRJbmZvVHlwZSwgZXZlbnRJbmZvOiBhbnkpIHtcbiAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICBpZiAoIXJhaXNlRXZlbnRNZXRob2QpIHtcbiAgICByYWlzZUV2ZW50TWV0aG9kID0gcGxhdGZvcm0uZmluZE1ldGhvZChcbiAgICAgICdNaWNyb3NvZnQuQXNwTmV0Q29yZS5CbGF6b3IuQnJvd3NlcicsICdNaWNyb3NvZnQuQXNwTmV0Q29yZS5CbGF6b3IuQnJvd3Nlci5SZW5kZXJpbmcnLCAnQnJvd3NlclJlbmRlcmVyRXZlbnREaXNwYXRjaGVyJywgJ0Rpc3BhdGNoRXZlbnQnXG4gICAgKTtcbiAgfVxuXG4gIGNvbnN0IGV2ZW50RGVzY3JpcHRvciA9IHtcbiAgICBCcm93c2VyUmVuZGVyZXJJZDogYnJvd3NlclJlbmRlcmVySWQsXG4gICAgQ29tcG9uZW50SWQ6IGNvbXBvbmVudElkLFxuICAgIEV2ZW50SGFuZGxlcklkOiBldmVudEhhbmRsZXJJZCxcbiAgICBFdmVudEFyZ3NUeXBlOiBldmVudEluZm9UeXBlXG4gIH07XG5cbiAgcGxhdGZvcm0uY2FsbE1ldGhvZChyYWlzZUV2ZW50TWV0aG9kLCBudWxsLCBbXG4gICAgcGxhdGZvcm0udG9Eb3ROZXRTdHJpbmcoSlNPTi5zdHJpbmdpZnkoZXZlbnREZXNjcmlwdG9yKSksXG4gICAgcGxhdGZvcm0udG9Eb3ROZXRTdHJpbmcoSlNPTi5zdHJpbmdpZnkoZXZlbnRJbmZvKSlcbiAgXSk7XG59XG5cbnR5cGUgRXZlbnRJbmZvVHlwZSA9ICdtb3VzZScgfCAna2V5Ym9hcmQnIHwgJ2NoYW5nZSc7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvUmVuZGVyaW5nL0Jyb3dzZXJSZW5kZXJlci50cyIsImltcG9ydCB7IFN5c3RlbV9BcnJheSwgUG9pbnRlciB9IGZyb20gJy4uL1BsYXRmb3JtL1BsYXRmb3JtJztcbmltcG9ydCB7IHBsYXRmb3JtIH0gZnJvbSAnLi4vRW52aXJvbm1lbnQnO1xuY29uc3QgcmVuZGVyVHJlZUVkaXRTdHJ1Y3RMZW5ndGggPSAxNjtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFJlbmRlclRyZWVFZGl0UHRyKHJlbmRlclRyZWVFZGl0czogU3lzdGVtX0FycmF5PFJlbmRlclRyZWVFZGl0UG9pbnRlcj4sIGluZGV4OiBudW1iZXIpIHtcbiAgcmV0dXJuIHBsYXRmb3JtLmdldEFycmF5RW50cnlQdHIocmVuZGVyVHJlZUVkaXRzLCBpbmRleCwgcmVuZGVyVHJlZUVkaXRTdHJ1Y3RMZW5ndGgpO1xufVxuXG5leHBvcnQgY29uc3QgcmVuZGVyVHJlZUVkaXQgPSB7XG4gIC8vIFRoZSBwcm9wZXJ0aWVzIGFuZCBtZW1vcnkgbGF5b3V0IG11c3QgYmUga2VwdCBpbiBzeW5jIHdpdGggdGhlIC5ORVQgZXF1aXZhbGVudCBpbiBSZW5kZXJUcmVlRWRpdC5jc1xuICB0eXBlOiAoZWRpdDogUmVuZGVyVHJlZUVkaXRQb2ludGVyKSA9PiBwbGF0Zm9ybS5yZWFkSW50MzJGaWVsZChlZGl0LCAwKSBhcyBFZGl0VHlwZSxcbiAgc2libGluZ0luZGV4OiAoZWRpdDogUmVuZGVyVHJlZUVkaXRQb2ludGVyKSA9PiBwbGF0Zm9ybS5yZWFkSW50MzJGaWVsZChlZGl0LCA0KSxcbiAgbmV3VHJlZUluZGV4OiAoZWRpdDogUmVuZGVyVHJlZUVkaXRQb2ludGVyKSA9PiBwbGF0Zm9ybS5yZWFkSW50MzJGaWVsZChlZGl0LCA4KSxcbiAgcmVtb3ZlZEF0dHJpYnV0ZU5hbWU6IChlZGl0OiBSZW5kZXJUcmVlRWRpdFBvaW50ZXIpID0+IHBsYXRmb3JtLnJlYWRTdHJpbmdGaWVsZChlZGl0LCAxMiksXG59O1xuXG5leHBvcnQgZW51bSBFZGl0VHlwZSB7XG4gIHByZXBlbmRGcmFtZSA9IDEsXG4gIHJlbW92ZUZyYW1lID0gMixcbiAgc2V0QXR0cmlidXRlID0gMyxcbiAgcmVtb3ZlQXR0cmlidXRlID0gNCxcbiAgdXBkYXRlVGV4dCA9IDUsXG4gIHN0ZXBJbiA9IDYsXG4gIHN0ZXBPdXQgPSA3LFxufVxuXG4vLyBOb21pbmFsIHR5cGUgdG8gZW5zdXJlIG9ubHkgdmFsaWQgcG9pbnRlcnMgYXJlIHBhc3NlZCB0byB0aGUgcmVuZGVyVHJlZUVkaXQgZnVuY3Rpb25zLlxuLy8gQXQgcnVudGltZSB0aGUgdmFsdWVzIGFyZSBqdXN0IG51bWJlcnMuXG5leHBvcnQgaW50ZXJmYWNlIFJlbmRlclRyZWVFZGl0UG9pbnRlciBleHRlbmRzIFBvaW50ZXIgeyBSZW5kZXJUcmVlRWRpdFBvaW50ZXJfX0RPX05PVF9JTVBMRU1FTlQ6IGFueSB9XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvUmVuZGVyaW5nL1JlbmRlclRyZWVFZGl0LnRzIiwiaW1wb3J0IHsgU3lzdGVtX1N0cmluZywgU3lzdGVtX0FycmF5LCBQb2ludGVyIH0gZnJvbSAnLi4vUGxhdGZvcm0vUGxhdGZvcm0nO1xuaW1wb3J0IHsgcGxhdGZvcm0gfSBmcm9tICcuLi9FbnZpcm9ubWVudCc7XG5jb25zdCByZW5kZXJUcmVlRnJhbWVTdHJ1Y3RMZW5ndGggPSAyODtcblxuLy8gVG8gbWluaW1pc2UgR0MgcHJlc3N1cmUsIGluc3RlYWQgb2YgaW5zdGFudGlhdGluZyBhIEpTIG9iamVjdCB0byByZXByZXNlbnQgZWFjaCB0cmVlIGZyYW1lLFxuLy8gd2Ugd29yayBpbiB0ZXJtcyBvZiBwb2ludGVycyB0byB0aGUgc3RydWN0cyBvbiB0aGUgLk5FVCBoZWFwLCBhbmQgdXNlIHN0YXRpYyBmdW5jdGlvbnMgdGhhdFxuLy8ga25vdyBob3cgdG8gcmVhZCBwcm9wZXJ0eSB2YWx1ZXMgZnJvbSB0aG9zZSBzdHJ1Y3RzLlxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VHJlZUZyYW1lUHRyKHJlbmRlclRyZWVFbnRyaWVzOiBTeXN0ZW1fQXJyYXk8UmVuZGVyVHJlZUZyYW1lUG9pbnRlcj4sIGluZGV4OiBudW1iZXIpIHtcbiAgcmV0dXJuIHBsYXRmb3JtLmdldEFycmF5RW50cnlQdHIocmVuZGVyVHJlZUVudHJpZXMsIGluZGV4LCByZW5kZXJUcmVlRnJhbWVTdHJ1Y3RMZW5ndGgpO1xufVxuXG5leHBvcnQgY29uc3QgcmVuZGVyVHJlZUZyYW1lID0ge1xuICAvLyBUaGUgcHJvcGVydGllcyBhbmQgbWVtb3J5IGxheW91dCBtdXN0IGJlIGtlcHQgaW4gc3luYyB3aXRoIHRoZSAuTkVUIGVxdWl2YWxlbnQgaW4gUmVuZGVyVHJlZUZyYW1lLmNzXG4gIGZyYW1lVHlwZTogKGZyYW1lOiBSZW5kZXJUcmVlRnJhbWVQb2ludGVyKSA9PiBwbGF0Zm9ybS5yZWFkSW50MzJGaWVsZChmcmFtZSwgNCkgYXMgRnJhbWVUeXBlLFxuICBzdWJ0cmVlTGVuZ3RoOiAoZnJhbWU6IFJlbmRlclRyZWVGcmFtZVBvaW50ZXIpID0+IHBsYXRmb3JtLnJlYWRJbnQzMkZpZWxkKGZyYW1lLCA4KSBhcyBGcmFtZVR5cGUsXG4gIGNvbXBvbmVudElkOiAoZnJhbWU6IFJlbmRlclRyZWVGcmFtZVBvaW50ZXIpID0+IHBsYXRmb3JtLnJlYWRJbnQzMkZpZWxkKGZyYW1lLCAxMiksXG4gIGVsZW1lbnROYW1lOiAoZnJhbWU6IFJlbmRlclRyZWVGcmFtZVBvaW50ZXIpID0+IHBsYXRmb3JtLnJlYWRTdHJpbmdGaWVsZChmcmFtZSwgMTYpLFxuICB0ZXh0Q29udGVudDogKGZyYW1lOiBSZW5kZXJUcmVlRnJhbWVQb2ludGVyKSA9PiBwbGF0Zm9ybS5yZWFkU3RyaW5nRmllbGQoZnJhbWUsIDE2KSxcbiAgYXR0cmlidXRlTmFtZTogKGZyYW1lOiBSZW5kZXJUcmVlRnJhbWVQb2ludGVyKSA9PiBwbGF0Zm9ybS5yZWFkU3RyaW5nRmllbGQoZnJhbWUsIDE2KSxcbiAgYXR0cmlidXRlVmFsdWU6IChmcmFtZTogUmVuZGVyVHJlZUZyYW1lUG9pbnRlcikgPT4gcGxhdGZvcm0ucmVhZFN0cmluZ0ZpZWxkKGZyYW1lLCAyNCksXG4gIGF0dHJpYnV0ZUV2ZW50SGFuZGxlcklkOiAoZnJhbWU6IFJlbmRlclRyZWVGcmFtZVBvaW50ZXIpID0+IHBsYXRmb3JtLnJlYWRJbnQzMkZpZWxkKGZyYW1lLCA4KSxcbn07XG5cbmV4cG9ydCBlbnVtIEZyYW1lVHlwZSB7XG4gIC8vIFRoZSB2YWx1ZXMgbXVzdCBiZSBrZXB0IGluIHN5bmMgd2l0aCB0aGUgLk5FVCBlcXVpdmFsZW50IGluIFJlbmRlclRyZWVGcmFtZVR5cGUuY3NcbiAgZWxlbWVudCA9IDEsXG4gIHRleHQgPSAyLFxuICBhdHRyaWJ1dGUgPSAzLFxuICBjb21wb25lbnQgPSA0LFxuICByZWdpb24gPSA1LFxufVxuXG4vLyBOb21pbmFsIHR5cGUgdG8gZW5zdXJlIG9ubHkgdmFsaWQgcG9pbnRlcnMgYXJlIHBhc3NlZCB0byB0aGUgcmVuZGVyVHJlZUZyYW1lIGZ1bmN0aW9ucy5cbi8vIEF0IHJ1bnRpbWUgdGhlIHZhbHVlcyBhcmUganVzdCBudW1iZXJzLlxuZXhwb3J0IGludGVyZmFjZSBSZW5kZXJUcmVlRnJhbWVQb2ludGVyIGV4dGVuZHMgUG9pbnRlciB7IFJlbmRlclRyZWVGcmFtZVBvaW50ZXJfX0RPX05PVF9JTVBMRU1FTlQ6IGFueSB9XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvUmVuZGVyaW5nL1JlbmRlclRyZWVGcmFtZS50cyIsImltcG9ydCB7IHJlZ2lzdGVyRnVuY3Rpb24gfSBmcm9tICcuLi9JbnRlcm9wL1JlZ2lzdGVyZWRGdW5jdGlvbic7XG5pbXBvcnQgeyBwbGF0Zm9ybSB9IGZyb20gJy4uL0Vudmlyb25tZW50JztcbmltcG9ydCB7IE1ldGhvZEhhbmRsZSwgU3lzdGVtX1N0cmluZyB9IGZyb20gJy4uL1BsYXRmb3JtL1BsYXRmb3JtJztcbmNvbnN0IGh0dHBDbGllbnRBc3NlbWJseSA9ICdNaWNyb3NvZnQuQXNwTmV0Q29yZS5CbGF6b3IuQnJvd3Nlcic7XG5jb25zdCBodHRwQ2xpZW50TmFtZXNwYWNlID0gYCR7aHR0cENsaWVudEFzc2VtYmx5fS5IdHRwYDtcbmNvbnN0IGh0dHBDbGllbnRUeXBlTmFtZSA9ICdCcm93c2VySHR0cE1lc3NhZ2VIYW5kbGVyJztcbmNvbnN0IGh0dHBDbGllbnRGdWxsVHlwZU5hbWUgPSBgJHtodHRwQ2xpZW50TmFtZXNwYWNlfS4ke2h0dHBDbGllbnRUeXBlTmFtZX1gO1xubGV0IHJlY2VpdmVSZXNwb25zZU1ldGhvZDogTWV0aG9kSGFuZGxlO1xuXG5yZWdpc3RlckZ1bmN0aW9uKGAke2h0dHBDbGllbnRGdWxsVHlwZU5hbWV9LlNlbmRgLCAoaWQ6IG51bWJlciwgbWV0aG9kOiBzdHJpbmcsIHJlcXVlc3RVcmk6IHN0cmluZywgYm9keTogc3RyaW5nIHwgbnVsbCwgaGVhZGVyc0pzb246IHN0cmluZyB8IG51bGwpID0+IHtcbiAgc2VuZEFzeW5jKGlkLCBtZXRob2QsIHJlcXVlc3RVcmksIGJvZHksIGhlYWRlcnNKc29uKTtcbn0pO1xuXG5hc3luYyBmdW5jdGlvbiBzZW5kQXN5bmMoaWQ6IG51bWJlciwgbWV0aG9kOiBzdHJpbmcsIHJlcXVlc3RVcmk6IHN0cmluZywgYm9keTogc3RyaW5nIHwgbnVsbCwgaGVhZGVyc0pzb246IHN0cmluZyB8IG51bGwpIHtcbiAgbGV0IHJlc3BvbnNlOiBSZXNwb25zZTtcbiAgbGV0IHJlc3BvbnNlVGV4dDogc3RyaW5nO1xuICB0cnkge1xuICAgIHJlc3BvbnNlID0gYXdhaXQgZmV0Y2gocmVxdWVzdFVyaSwge1xuICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICBib2R5OiBib2R5IHx8IHVuZGVmaW5lZCxcbiAgICAgIGhlYWRlcnM6IGhlYWRlcnNKc29uID8gKEpTT04ucGFyc2UoaGVhZGVyc0pzb24pIGFzIHN0cmluZ1tdW10pIDogdW5kZWZpbmVkXG4gICAgfSk7XG4gICAgcmVzcG9uc2VUZXh0ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xuICB9IGNhdGNoIChleCkge1xuICAgIGRpc3BhdGNoRXJyb3JSZXNwb25zZShpZCwgZXgudG9TdHJpbmcoKSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZGlzcGF0Y2hTdWNjZXNzUmVzcG9uc2UoaWQsIHJlc3BvbnNlLCByZXNwb25zZVRleHQpO1xufVxuXG5mdW5jdGlvbiBkaXNwYXRjaFN1Y2Nlc3NSZXNwb25zZShpZDogbnVtYmVyLCByZXNwb25zZTogUmVzcG9uc2UsIHJlc3BvbnNlVGV4dDogc3RyaW5nKSB7XG4gIGNvbnN0IHJlc3BvbnNlRGVzY3JpcHRvcjogUmVzcG9uc2VEZXNjcmlwdG9yID0ge1xuICAgIFN0YXR1c0NvZGU6IHJlc3BvbnNlLnN0YXR1cyxcbiAgICBIZWFkZXJzOiBbXVxuICB9O1xuICByZXNwb25zZS5oZWFkZXJzLmZvckVhY2goKHZhbHVlLCBuYW1lKSA9PiB7XG4gICAgcmVzcG9uc2VEZXNjcmlwdG9yLkhlYWRlcnMucHVzaChbbmFtZSwgdmFsdWVdKTtcbiAgfSk7XG5cbiAgZGlzcGF0Y2hSZXNwb25zZShcbiAgICBpZCxcbiAgICBwbGF0Zm9ybS50b0RvdE5ldFN0cmluZyhKU09OLnN0cmluZ2lmeShyZXNwb25zZURlc2NyaXB0b3IpKSxcbiAgICBwbGF0Zm9ybS50b0RvdE5ldFN0cmluZyhyZXNwb25zZVRleHQpLCAvLyBUT0RPOiBDb25zaWRlciBob3cgdG8gaGFuZGxlIG5vbi1zdHJpbmcgcmVzcG9uc2VzXG4gICAgLyogZXJyb3JNZXNzYWdlICovIG51bGxcbiAgKTtcbn1cblxuZnVuY3Rpb24gZGlzcGF0Y2hFcnJvclJlc3BvbnNlKGlkOiBudW1iZXIsIGVycm9yTWVzc2FnZTogc3RyaW5nKSB7XG4gIGRpc3BhdGNoUmVzcG9uc2UoXG4gICAgaWQsXG4gICAgLyogcmVzcG9uc2VEZXNjcmlwdG9yICovIG51bGwsXG4gICAgLyogcmVzcG9uc2VUZXh0ICovIG51bGwsXG4gICAgcGxhdGZvcm0udG9Eb3ROZXRTdHJpbmcoZXJyb3JNZXNzYWdlKVxuICApO1xufVxuXG5mdW5jdGlvbiBkaXNwYXRjaFJlc3BvbnNlKGlkOiBudW1iZXIsIHJlc3BvbnNlRGVzY3JpcHRvcjogU3lzdGVtX1N0cmluZyB8IG51bGwsIHJlc3BvbnNlVGV4dDogU3lzdGVtX1N0cmluZyB8IG51bGwsIGVycm9yTWVzc2FnZTogU3lzdGVtX1N0cmluZyB8IG51bGwpIHtcbiAgaWYgKCFyZWNlaXZlUmVzcG9uc2VNZXRob2QpIHtcbiAgICByZWNlaXZlUmVzcG9uc2VNZXRob2QgPSBwbGF0Zm9ybS5maW5kTWV0aG9kKFxuICAgICAgaHR0cENsaWVudEFzc2VtYmx5LFxuICAgICAgaHR0cENsaWVudE5hbWVzcGFjZSxcbiAgICAgIGh0dHBDbGllbnRUeXBlTmFtZSxcbiAgICAgICdSZWNlaXZlUmVzcG9uc2UnXG4gICAgKTtcbiAgfVxuXG4gIHBsYXRmb3JtLmNhbGxNZXRob2QocmVjZWl2ZVJlc3BvbnNlTWV0aG9kLCBudWxsLCBbXG4gICAgcGxhdGZvcm0udG9Eb3ROZXRTdHJpbmcoaWQudG9TdHJpbmcoKSksXG4gICAgcmVzcG9uc2VEZXNjcmlwdG9yLFxuICAgIHJlc3BvbnNlVGV4dCxcbiAgICBlcnJvck1lc3NhZ2UsXG4gIF0pO1xufVxuXG4vLyBLZWVwIHRoaXMgaW4gc3luYyB3aXRoIHRoZSAuTkVUIGVxdWl2YWxlbnQgaW4gSHR0cENsaWVudC5jc1xuaW50ZXJmYWNlIFJlc3BvbnNlRGVzY3JpcHRvciB7XG4gIC8vIFdlIGRvbid0IGhhdmUgQm9keVRleHQgaW4gaGVyZSBiZWNhdXNlIGlmIHdlIGRpZCwgdGhlbiBpbiB0aGUgSlNPTi1yZXNwb25zZSBjYXNlICh3aGljaFxuICAvLyBpcyB0aGUgbW9zdCBjb21tb24gY2FzZSksIHdlJ2QgYmUgZG91YmxlLWVuY29kaW5nIGl0LCBzaW5jZSB0aGUgZW50aXJlIFJlc3BvbnNlRGVzY3JpcHRvclxuICAvLyBhbHNvIGdldHMgSlNPTiBlbmNvZGVkLiBJdCB3b3VsZCB3b3JrIGJ1dCBpcyB0d2ljZSB0aGUgYW1vdW50IG9mIHN0cmluZyBwcm9jZXNzaW5nLlxuICBTdGF0dXNDb2RlOiBudW1iZXI7XG4gIEhlYWRlcnM6IHN0cmluZ1tdW107XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvU2VydmljZXMvSHR0cC50cyIsImltcG9ydCB7IHJlZ2lzdGVyRnVuY3Rpb24gfSBmcm9tICcuLi9JbnRlcm9wL1JlZ2lzdGVyZWRGdW5jdGlvbic7XG5pbXBvcnQgeyBwbGF0Zm9ybSB9IGZyb20gJy4uL0Vudmlyb25tZW50JztcbmltcG9ydCB7IE1ldGhvZEhhbmRsZSB9IGZyb20gJy4uL1BsYXRmb3JtL1BsYXRmb3JtJztcbmNvbnN0IHJlZ2lzdGVyZWRGdW5jdGlvblByZWZpeCA9ICdNaWNyb3NvZnQuQXNwTmV0Q29yZS5CbGF6b3IuQnJvd3Nlci5TZXJ2aWNlcy5Ccm93c2VyVXJpSGVscGVyJztcbmxldCBub3RpZnlMb2NhdGlvbkNoYW5nZWRNZXRob2Q6IE1ldGhvZEhhbmRsZTtcbmxldCBoYXNSZWdpc3RlcmVkRXZlbnRMaXN0ZW5lcnMgPSBmYWxzZTtcblxucmVnaXN0ZXJGdW5jdGlvbihgJHtyZWdpc3RlcmVkRnVuY3Rpb25QcmVmaXh9LmdldExvY2F0aW9uSHJlZmAsXG4gICgpID0+IHBsYXRmb3JtLnRvRG90TmV0U3RyaW5nKGxvY2F0aW9uLmhyZWYpKTtcblxucmVnaXN0ZXJGdW5jdGlvbihgJHtyZWdpc3RlcmVkRnVuY3Rpb25QcmVmaXh9LmdldEJhc2VVUklgLFxuICAoKSA9PiBkb2N1bWVudC5iYXNlVVJJID8gcGxhdGZvcm0udG9Eb3ROZXRTdHJpbmcoZG9jdW1lbnQuYmFzZVVSSSkgOiBudWxsKTtcblxucmVnaXN0ZXJGdW5jdGlvbihgJHtyZWdpc3RlcmVkRnVuY3Rpb25QcmVmaXh9LmVuYWJsZU5hdmlnYXRpb25JbnRlY2VwdGlvbmAsICgpID0+IHtcbiAgaWYgKGhhc1JlZ2lzdGVyZWRFdmVudExpc3RlbmVycykge1xuICAgIHJldHVybjtcbiAgfVxuICBoYXNSZWdpc3RlcmVkRXZlbnRMaXN0ZW5lcnMgPSB0cnVlO1xuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xuICAgIC8vIEludGVyY2VwdCBjbGlja3Mgb24gYWxsIDxhPiBlbGVtZW50cyB3aGVyZSB0aGUgaHJlZiBpcyB3aXRoaW4gdGhlIDxiYXNlIGhyZWY+IFVSSSBzcGFjZVxuICAgIGNvbnN0IGFuY2hvclRhcmdldCA9IGZpbmRDbG9zZXN0QW5jZXN0b3IoZXZlbnQudGFyZ2V0IGFzIEVsZW1lbnQgfCBudWxsLCAnQScpO1xuICAgIGlmIChhbmNob3JUYXJnZXQpIHtcbiAgICAgIGNvbnN0IGhyZWYgPSBhbmNob3JUYXJnZXQuZ2V0QXR0cmlidXRlKCdocmVmJyk7XG4gICAgICBpZiAoaXNXaXRoaW5CYXNlVXJpU3BhY2UodG9BYnNvbHV0ZVVyaShocmVmKSkpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgaGlzdG9yeS5wdXNoU3RhdGUobnVsbCwgLyogaWdub3JlZCB0aXRsZSAqLyAnJywgaHJlZik7XG4gICAgICAgIGhhbmRsZUludGVybmFsTmF2aWdhdGlvbigpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgaGFuZGxlSW50ZXJuYWxOYXZpZ2F0aW9uKTtcbn0pO1xuXG5mdW5jdGlvbiBoYW5kbGVJbnRlcm5hbE5hdmlnYXRpb24oKSB7XG4gIGlmICghbm90aWZ5TG9jYXRpb25DaGFuZ2VkTWV0aG9kKSB7XG4gICAgbm90aWZ5TG9jYXRpb25DaGFuZ2VkTWV0aG9kID0gcGxhdGZvcm0uZmluZE1ldGhvZChcbiAgICAgICdNaWNyb3NvZnQuQXNwTmV0Q29yZS5CbGF6b3IuQnJvd3NlcicsXG4gICAgICAnTWljcm9zb2Z0LkFzcE5ldENvcmUuQmxhem9yLkJyb3dzZXIuU2VydmljZXMnLFxuICAgICAgJ0Jyb3dzZXJVcmlIZWxwZXInLFxuICAgICAgJ05vdGlmeUxvY2F0aW9uQ2hhbmdlZCdcbiAgICApO1xuICB9XG5cbiAgcGxhdGZvcm0uY2FsbE1ldGhvZChub3RpZnlMb2NhdGlvbkNoYW5nZWRNZXRob2QsIG51bGwsIFtcbiAgICBwbGF0Zm9ybS50b0RvdE5ldFN0cmluZyhsb2NhdGlvbi5ocmVmKVxuICBdKTtcbn1cblxubGV0IHRlc3RBbmNob3I6IEhUTUxBbmNob3JFbGVtZW50O1xuZnVuY3Rpb24gdG9BYnNvbHV0ZVVyaShyZWxhdGl2ZVVyaTogc3RyaW5nKSB7XG4gIHRlc3RBbmNob3IgPSB0ZXN0QW5jaG9yIHx8IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgdGVzdEFuY2hvci5ocmVmID0gcmVsYXRpdmVVcmk7XG4gIHJldHVybiB0ZXN0QW5jaG9yLmhyZWY7XG59XG5cbmZ1bmN0aW9uIGZpbmRDbG9zZXN0QW5jZXN0b3IoZWxlbWVudDogRWxlbWVudCB8IG51bGwsIHRhZ05hbWU6IHN0cmluZykge1xuICByZXR1cm4gIWVsZW1lbnRcbiAgICA/IG51bGxcbiAgICA6IGVsZW1lbnQudGFnTmFtZSA9PT0gdGFnTmFtZVxuICAgICAgPyBlbGVtZW50XG4gICAgICA6IGZpbmRDbG9zZXN0QW5jZXN0b3IoZWxlbWVudC5wYXJlbnRFbGVtZW50LCB0YWdOYW1lKVxufVxuXG5mdW5jdGlvbiBpc1dpdGhpbkJhc2VVcmlTcGFjZShocmVmOiBzdHJpbmcpIHtcbiAgY29uc3QgYmFzZVVyaVByZWZpeFdpdGhUcmFpbGluZ1NsYXNoID0gdG9CYXNlVXJpUHJlZml4V2l0aFRyYWlsaW5nU2xhc2goZG9jdW1lbnQuYmFzZVVSSSEpOyAvLyBUT0RPOiBNaWdodCBiYXNlVVJJIHJlYWxseSBiZSBudWxsP1xuICByZXR1cm4gaHJlZi5zdGFydHNXaXRoKGJhc2VVcmlQcmVmaXhXaXRoVHJhaWxpbmdTbGFzaCk7XG59XG5cbmZ1bmN0aW9uIHRvQmFzZVVyaVByZWZpeFdpdGhUcmFpbGluZ1NsYXNoKGJhc2VVcmk6IHN0cmluZykge1xuICByZXR1cm4gYmFzZVVyaS5zdWJzdHIoMCwgYmFzZVVyaS5sYXN0SW5kZXhPZignLycpICsgMSk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvU2VydmljZXMvVXJpSGVscGVyLnRzIiwiaW1wb3J0IHsgcGxhdGZvcm0gfSBmcm9tICcuL0Vudmlyb25tZW50J1xuaW1wb3J0IHsgcmVnaXN0ZXJGdW5jdGlvbiB9IGZyb20gJy4vSW50ZXJvcC9SZWdpc3RlcmVkRnVuY3Rpb24nO1xuXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgLy8gV2hlbiB0aGUgbGlicmFyeSBpcyBsb2FkZWQgaW4gYSBicm93c2VyIHZpYSBhIDxzY3JpcHQ+IGVsZW1lbnQsIG1ha2UgdGhlXG4gIC8vIGZvbGxvd2luZyBBUElzIGF2YWlsYWJsZSBpbiBnbG9iYWwgc2NvcGUgZm9yIGludm9jYXRpb24gZnJvbSBKU1xuICB3aW5kb3dbJ0JsYXpvciddID0ge1xuICAgIHBsYXRmb3JtLFxuICAgIHJlZ2lzdGVyRnVuY3Rpb24sXG4gIH07XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvR2xvYmFsRXhwb3J0cy50cyJdLCJzb3VyY2VSb290IjoiIn0=