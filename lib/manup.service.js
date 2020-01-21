"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
var semver = require("semver");
var i18n_1 = require("./i18n");
var manup_config_1 = require("./manup.config");
var core_1 = require("@angular/core");
var ngx_1 = require("@ionic-native/app-version/ngx");
var angular_1 = require("@ionic/angular");
var http_1 = require("@angular/common/http");
var ngx_2 = require("@ionic-native/in-app-browser/ngx");
var storage_1 = require("@ionic/storage");
var operators_1 = require("rxjs/operators");
/**
 * DI InjectionToken for optional ngx-translate
 */
exports.TRANSLATE_SERVICE = new core_1.InjectionToken('manup:translate');
var STORAGE_KEY = 'com.nextfaze.ionic-manup';
/**
 * The types of alerts we may present
 */
var AlertType;
(function (AlertType) {
    /**
     * A mandatory update is required
     */
    AlertType[AlertType["MANDATORY"] = 0] = "MANDATORY";
    /**
     * An optional update is available
     */
    AlertType[AlertType["OPTIONAL"] = 1] = "OPTIONAL";
    /**
     * The app is disabled
     */
    AlertType[AlertType["MAINTENANCE"] = 2] = "MAINTENANCE";
    /**
     * Nothing to see here
     */
    AlertType[AlertType["NOP"] = 3] = "NOP";
})(AlertType = exports.AlertType || (exports.AlertType = {}));
var ManUpService = /** @class */ (function () {
    function ManUpService(config, http, alert, platform, iab, AppVersion, translate, storage) {
        this.config = config;
        this.http = http;
        this.alert = alert;
        this.platform = platform;
        this.iab = iab;
        this.AppVersion = AppVersion;
        this.translate = translate;
        this.storage = storage;
        /**
         * True if there is an alert already displayed. Used to prevent multiple alerts
         * being presented on top of one another
         */
        this.inProgress = false;
    }
    /**
     * Loads the translations into the translation service.
     *
     * * Loads the language requested, if available
     * * Loads the default lang, if we have it
     * * Loads english into the default lang as a last resort
     */
    ManUpService.prototype.loadTranslations = function () {
        if (i18n_1.i18n[this.translate.currentLang]) {
            this.translate.setTranslation(this.translate.currentLang, i18n_1.i18n[this.translate.currentLang].translations, true);
        }
        // load the default language, if we have it
        else if (i18n_1.i18n[this.translate.defaultLang]) {
            this.translate.setTranslation(this.translate.defaultLang, i18n_1.i18n[this.translate.defaultLang].translations, true);
        }
        // fall back to english, so we never see the raw translation strings
        else {
            this.translate.setTranslation(this.translate.defaultLang, i18n_1.i18n.en.translations, true);
        }
    };
    /**
     * Begins the manup check process.
     *
     * @Returns a promise that resolves if the app is able to continue.
     */
    ManUpService.prototype.validate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                try {
                    if (!this.inProgress) {
                        this.inProgress = true;
                        this.currentPromise = new Promise(function (resolve, reject) {
                            _this.platform.ready().then(function () { return __awaiter(_this, void 0, void 0, function () {
                                var metadata, platformData, result, _a, e_1;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0: return [4 /*yield*/, this.metadata()];
                                        case 1:
                                            metadata = _b.sent();
                                            // Be generous, if we couldn't get the ManUp data let the app run
                                            if (!metadata) {
                                                return [2 /*return*/, resolve()];
                                            }
                                            _b.label = 2;
                                        case 2:
                                            _b.trys.push([2, 9, , 10]);
                                            return [4 /*yield*/, this.getPlatformData(metadata)];
                                        case 3:
                                            platformData = _b.sent();
                                            return [4 /*yield*/, this.evaluate(platformData)];
                                        case 4:
                                            result = _b.sent();
                                            _a = result;
                                            switch (_a) {
                                                case AlertType.NOP: return [3 /*break*/, 5];
                                            }
                                            return [3 /*break*/, 6];
                                        case 5:
                                            resolve();
                                            return [3 /*break*/, 8];
                                        case 6: return [4 /*yield*/, this.presentAlert(result, platformData)];
                                        case 7:
                                            _b.sent();
                                            resolve();
                                            _b.label = 8;
                                        case 8: return [3 /*break*/, 10];
                                        case 9:
                                            e_1 = _b.sent();
                                            return [2 /*return*/, resolve()];
                                        case 10: return [2 /*return*/];
                                    }
                                });
                            }); });
                        });
                    }
                    return [2 /*return*/, this.currentPromise];
                }
                catch (err) {
                    return [2 /*return*/, Promise.resolve()];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Evaluates what kind of update is required, if any.
     *
     * Returns a promise that resolves with an alert type.
     */
    ManUpService.prototype.evaluate = function (metadata) {
        return __awaiter(this, void 0, void 0, function () {
            var version;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!metadata.enabled) {
                            return [2 /*return*/, Promise.resolve(AlertType.MAINTENANCE)];
                        }
                        return [4 /*yield*/, this.AppVersion.getVersionNumber()];
                    case 1:
                        version = _a.sent();
                        if (semver.lt(version, metadata.minimum)) {
                            return [2 /*return*/, AlertType.MANDATORY];
                        }
                        else if (semver.lt(version, metadata.latest)) {
                            return [2 /*return*/, AlertType.OPTIONAL];
                        }
                        return [2 /*return*/, AlertType.NOP];
                }
            });
        });
    };
    /**
     * Fetches the remote metadata and returns an observable with the json
     */
    ManUpService.prototype.metadata = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.http
                                .get(this.config.url).pipe(operators_1.map(function (response) { return response.json(); })).toPromise()];
                    case 1:
                        response = _a.sent();
                        if (this.storage) {
                            alert(response);
                            this.saveMetadata(response).catch(function () { });
                        }
                        return [2 /*return*/, response];
                    case 2:
                        err_1 = _a.sent();
                        return [2 /*return*/, this.metadataFromStorage()];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Gets the version metadata from storage, if available.
     *
     * @private
     * @throws An error if the service was instantiated without a Storage component.
     * @returns {Promise<any>} That resolves with the metadata
     *
     * @memberOf ManUpService
     */
    ManUpService.prototype.metadataFromStorage = function () {
        if (this.storage) {
            return this.storage.get(STORAGE_KEY + '.manup').then(function (data) { return JSON.parse(data); });
        }
        else {
            throw new Error('Storage not configured');
        }
    };
    /**
     *
     * Saves the metadata to storage.
     *
     * @private
     * @param {ManUpData} metadata The metadata to store
     * @throws {Error} if storage if not configured
     * @returns {Promise<any>} A promise that resolves when the save succeeds
     *
     * @memberOf ManUpService
     */
    ManUpService.prototype.saveMetadata = function (metadata) {
        if (this.storage) {
            return this.storage.set(STORAGE_KEY + '.manup', JSON.stringify(metadata));
        }
        else {
            throw new Error('Storage not configured');
        }
    };
    /**
     * Returns the branch of the metadata relevant to this platform
     */
    ManUpService.prototype.getPlatformData = function (metadata) {
        if (!metadata) {
            throw new Error('metadata does not exist');
        }
        if (this.platform.is('ios')) {
            return metadata.ios;
        }
        if (this.platform.is('android')) {
            return metadata.android;
        }
        if (this.platform.is('desktop')) {
            return metadata.windows;
        }
        throw new Error('Unknown platform');
    };
    /**
     * Presents an update alert.
     *
     * @param type The type of alert to show
     * @param platformData The metadata for the platform
     *
     * @returns A promise that resolves when this whole thing is over.
     */
    ManUpService.prototype.presentAlert = function (type, platformData) {
        // load the translations unless we've been told not to
        if (this.translate && !this.config.externalTranslations) {
            this.loadTranslations();
        }
        switch (type) {
            case AlertType.MANDATORY:
                return this.presentMandatoryUpdate(platformData);
            case AlertType.OPTIONAL:
                return this.presentOptionalUpdate(platformData);
            case AlertType.MAINTENANCE:
                return this.presentMaintenanceMode();
        }
    };
    /**
     * Displays a maintenance mode alert.
     *
     * @returns a promise that will never resolve, because the app should not continue
     */
    ManUpService.prototype.presentMaintenanceMode = function () {
        var _this = this;
        return this.AppVersion.getAppName().then(function (name) {
            return new Promise(function (resolve, reject) {
                _this.alert.create({
                    backdropDismiss: false,
                    header: _this.translate
                        ? _this.translate.instant('manup.maintenance.title', { app: name })
                        : name + " Unavailable",
                    subHeader: _this.translate
                        ? _this.translate.instant('manup.maintenance.text', { app: name })
                        : name + " is currently unavailable. Please check back later",
                    cssClass: 'app-update-alert',
                }).then(function (alert) { return alert.present(); });
            });
        });
    };
    /**
     * Displays a mandatory update alert.
     *
     * @returns a promise that will never resolve, because the app should not continue
     */
    ManUpService.prototype.presentMandatoryUpdate = function (platformData) {
        var _this = this;
        return this.AppVersion.getAppName().then(function (name) {
            return new Promise(function (resolve, reject) {
                _this.alert.create({
                    backdropDismiss: false,
                    header: _this.translate
                        ? _this.translate.instant('manup.mandatory.title', { app: name })
                        : 'Update Required',
                    subHeader: _this.translate
                        ? _this.translate.instant('manup.mandatory.text', { app: name })
                        : "An update to " + name + " is required to continue.",
                    cssClass: 'app-update-alert',
                    buttons: [
                        {
                            text: _this.translate ? _this.translate.instant('manup.buttons.update') : 'Update',
                            handler: function () {
                                _this.iab.create(platformData.url, '_system');
                                return false;
                            }
                        }
                    ]
                }).then(function (alert) { return alert.present(); });
            });
        });
    };
    /**
     * Displays an optional update alert.
     *
     * @returns a promise that will resolves if the user selects 'not now'
     */
    ManUpService.prototype.presentOptionalUpdate = function (platformData) {
        var _this = this;
        return this.AppVersion.getAppName().then(function (name) {
            return new Promise(function (resolve, reject) {
                _this.alert.create({
                    backdropDismiss: false,
                    header: _this.translate
                        ? _this.translate.instant('manup.optional.title', { app: name })
                        : 'Update Available',
                    subHeader: _this.translate
                        ? _this.translate.instant('manup.optional.text', { app: name })
                        : "An update to " + name + " is available. Would you like to update?",
                    cssClass: 'app-update-alert',
                    buttons: [
                        {
                            text: _this.translate ? _this.translate.instant('manup.buttons.later') : 'Not Now',
                            handler: function () {
                                resolve();
                            }
                        },
                        {
                            text: _this.translate ? _this.translate.instant('manup.buttons.update') : 'Update',
                            handler: function () {
                                _this.iab.create(platformData.url, '_system');
                                return false;
                            }
                        }
                    ]
                }).then(function (alert) { return alert.present(); });
            });
        });
    };
    ManUpService = __decorate([
        core_1.Injectable(),
        __param(6, core_1.Optional()),
        __param(6, core_1.Inject(exports.TRANSLATE_SERVICE)),
        __param(7, core_1.Optional()),
        __metadata("design:paramtypes", [manup_config_1.ManUpConfig,
            http_1.HttpClient,
            angular_1.AlertController,
            angular_1.Platform,
            ngx_2.InAppBrowser,
            ngx_1.AppVersion, Object, storage_1.Storage])
    ], ManUpService);
    return ManUpService;
}());
exports.ManUpService = ManUpService;
//# sourceMappingURL=manup.service.js.map