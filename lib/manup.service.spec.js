"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var timers_1 = require("timers");
var i18n_1 = require("./i18n");
var manup_service_1 = require("./manup.service");
var rxjs_1 = require("rxjs");
var MockAppVersion = /** @class */ (function () {
    function MockAppVersion() {
    }
    MockAppVersion.reset = function () {
        this.version = this.defaultVersion;
    };
    MockAppVersion.getVersionNumber = function () {
        return Promise.resolve(MockAppVersion.version);
    };
    MockAppVersion.defaultVersion = '2.3.4';
    MockAppVersion.version = '2.3.4';
    return MockAppVersion;
}());
describe('Manup Spec', function () {
    describe('constructor', function () { });
    describe('loadTranslations', function () {
        var manup;
        var mockTranslate;
        beforeEach(function () {
            var config = {
                externalTranslations: true
            };
            mockTranslate = {
                setTranslation: jasmine.createSpy('setTranslation').and.returnValue(Promise.resolve())
            };
            manup = new manup_service_1.ManUpService(config, null, null, null, null, null, mockTranslate, null);
        });
        it('Should load translations for a language we support', function () {
            mockTranslate.currentLang = 'en';
            manup.loadTranslations();
            expect(mockTranslate.setTranslation).toHaveBeenCalledWith('en', i18n_1.i18n.en.translations, true);
        });
        it('Should load translations for the default lang if we dont support the requested lang', function () {
            mockTranslate.defaultLang = 'it';
            mockTranslate.currentLang = 'asdf';
            manup.loadTranslations();
            expect(mockTranslate.setTranslation).toHaveBeenCalledWith('it', i18n_1.i18n.it.translations, true);
        });
        it('Should load english if we dont support the requested or default languages', function () {
            mockTranslate.defaultLang = 'notReal';
            mockTranslate.currentLang = 'asdf';
            manup.loadTranslations();
            expect(mockTranslate.setTranslation).toHaveBeenCalledWith('notReal', i18n_1.i18n.en.translations, true);
        });
    });
    describe('validate', function () {
        var _this = this;
        var json = {
            minimum: '2.4.5',
            latest: '2.4.5',
            url: 'http://example.com',
            enabled: true
        };
        var mockTranslate = {
            setTranslation: function () { }
        };
        var mockHttp = {
            get: function (url) {
                return rxjs_1.of({
                    json: function () {
                        return {
                            ios: __assign({}, json)
                        };
                    }
                });
            }
        };
        var config = {
            externalTranslations: false,
            url: 'http://example.com'
        };
        var mockAlert = {
            create: jasmine.createSpy('create').and.returnValue(Promise.resolve())
        };
        beforeEach(function () {
            json = {
                minimum: '2.4.5',
                latest: '2.4.5',
                url: 'http://example.com',
                enabled: true
            };
            MockAppVersion.reset();
        });
        it('should call presentAlert with the platform data', function (done) {
            var mockPlatform = {
                ready: function () { return Promise.resolve(); },
                is: function (platform) { return platform === 'ios'; }
            };
            var manup = new manup_service_1.ManUpService(config, mockHttp, mockAlert, mockPlatform, null, MockAppVersion, null, null);
            spyOn(manup, 'presentAlert');
            manup.validate();
            timers_1.setTimeout(function () {
                expect(manup.presentAlert).toHaveBeenCalledWith(manup_service_1.AlertType.MANDATORY, {
                    minimum: '2.4.5',
                    latest: '2.4.5',
                    enabled: true,
                    url: 'http://example.com'
                });
                done();
            }, 1000);
        });
        it('Should silently resolve if the platform was not found in manup config', function () { return __awaiter(_this, void 0, void 0, function () {
            var mockPlatform, manup, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockPlatform = {
                            ready: function () { return Promise.resolve(); },
                            is: function (platform) { return platform === 'browser'; }
                        };
                        manup = new manup_service_1.ManUpService(config, mockHttp, mockAlert, mockPlatform, null, MockAppVersion, null, null);
                        spyOn(manup, 'presentAlert');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, manup.validate()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        expect(e_1).toBeUndefined();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        it('Promise resolves once optional alert resolves', function () { return __awaiter(_this, void 0, void 0, function () {
            var mockPlatform, manup;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockPlatform = {
                            ready: function () { return Promise.resolve(); },
                            is: function (platform) { return platform === 'ios'; }
                        };
                        json.minimum = '2.0.0';
                        json.latest = '2.5.0';
                        MockAppVersion.version = '2.4.0';
                        manup = new manup_service_1.ManUpService(config, mockHttp, mockAlert, mockPlatform, null, MockAppVersion, null, null);
                        spyOn(manup, 'presentAlert');
                        return [4 /*yield*/, manup.validate()];
                    case 1:
                        _a.sent();
                        expect(manup.presentAlert).toHaveBeenCalledWith(manup_service_1.AlertType.OPTIONAL, {
                            minimum: '2.0.0',
                            latest: '2.5.0',
                            enabled: true,
                            url: 'http://example.com'
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('evaluate', function () {
        it('Should return maintenance mode if json says disabled', function (done) {
            var json = {
                minimum: '2.3.4',
                latest: '2.3.4',
                url: 'http://example.com',
                enabled: false
            };
            var manup = new manup_service_1.ManUpService(null, null, null, null, null, MockAppVersion, null, null);
            manup.evaluate(json).then(function (alert) {
                expect(alert).toEqual(manup_service_1.AlertType.MAINTENANCE);
                done();
            });
        });
        it('Should return mandatory update if app version less than minimum', function (done) {
            var json = {
                minimum: '4.3.4',
                latest: '6.3.4',
                url: 'http://example.com',
                enabled: true
            };
            var manup = new manup_service_1.ManUpService(null, null, null, null, null, MockAppVersion, null, null);
            manup.evaluate(json).then(function (alert) {
                expect(alert).toEqual(manup_service_1.AlertType.MANDATORY);
                done();
            });
        });
        it('Should return optional update if app version less than latest', function (done) {
            var json = {
                minimum: '2.3.4',
                latest: '6.3.4',
                url: 'http://example.com',
                enabled: true
            };
            var manup = new manup_service_1.ManUpService(null, null, null, null, null, MockAppVersion, null, null);
            manup.evaluate(json).then(function (alert) {
                expect(alert).toEqual(manup_service_1.AlertType.OPTIONAL);
                done();
            });
        });
        it('Should return nop if app version latest', function (done) {
            var json = {
                minimum: '2.3.4',
                latest: '2.3.4',
                url: 'http://example.com',
                enabled: true
            };
            var manup = new manup_service_1.ManUpService(null, null, null, null, null, MockAppVersion, null, null);
            manup.evaluate(json).then(function (alert) {
                expect(alert).toEqual(manup_service_1.AlertType.NOP);
                done();
            });
        });
    });
    describe('metadata', function () {
        var config = {
            url: 'test.example.com'
        };
        describe('Http route, no storage configured', function () {
            var mockHttp = {
                get: function (url) {
                    return rxjs_1.of({
                        json: function () {
                            return {
                                ios: {
                                    minimum: '1.0.0',
                                    latest: '2.4.5',
                                    enabled: true,
                                    url: 'http://http.example.com'
                                }
                            };
                        }
                    });
                }
            };
            it('Should make an http request', function (done) {
                spyOn(mockHttp, 'get').and.callThrough();
                var manup = new manup_service_1.ManUpService(config, mockHttp, null, null, null, null, null, null);
                manup.metadata().then(function (data) {
                    expect(mockHttp.get).toHaveBeenCalled();
                    done();
                });
            });
            it('Should return json', function (done) {
                var manup = new manup_service_1.ManUpService(config, mockHttp, null, null, null, null, null, null);
                manup.metadata().then(function (data) {
                    expect(data.ios).toBeDefined();
                    expect(data.ios.url).toBe('http://http.example.com');
                    done();
                });
            });
            it('Should throw an exception if http request fails', function (done) {
                var mockHttpErr = {
                    get: function (url) {
                        return rxjs_1.Observable.throw(new Error('no good son'));
                    }
                };
                var manup = new manup_service_1.ManUpService(config, mockHttpErr, null, null, null, null, null, null);
                manup.metadata().then(function (data) {
                    expect(true).toBe(null);
                    done();
                }, function (err) {
                    expect(err).toBeDefined();
                    done();
                });
            });
            it('Should throw an exception if http returns null as it does from time to time', function (done) {
                var mockHttpErr = {
                    get: function (url) {
                        return rxjs_1.of(null);
                    }
                };
                var manup = new manup_service_1.ManUpService(config, mockHttpErr, null, null, null, null, null, null);
                manup.metadata().then(function (data) {
                    expect(true).toBe(null);
                    done();
                }, function (err) {
                    expect(err).toBeDefined();
                    done();
                });
            });
        });
        describe('Http route, with storage', function () {
            var mockHttp = {
                get: function (url) {
                    return rxjs_1.of({
                        json: function () {
                            return {
                                ios: {
                                    minimum: '1.0.0',
                                    latest: '2.4.5',
                                    enabled: true,
                                    url: 'http://http.example.com'
                                }
                            };
                        }
                    });
                }
            };
            var mockStorage = {
                set: function (key, value) {
                    return Promise.resolve();
                }
            };
            var response;
            var manup;
            beforeAll(function (done) {
                manup = new manup_service_1.ManUpService(config, mockHttp, null, null, null, null, null, (mockStorage));
                spyOn(mockHttp, 'get').and.callThrough();
                spyOn(manup, 'saveMetadata').and.callThrough();
                manup.metadata().then(function (data) {
                    response = data;
                    done();
                });
            });
            it('Should make an http request', function () {
                expect(mockHttp.get).toHaveBeenCalled();
            });
            it('Should store the result to storage', function () {
                expect(manup.saveMetadata).toHaveBeenCalled();
            });
            it('Should return json', function () {
                expect(response.ios).toBeDefined();
                expect(response.ios.url).toBe('http://http.example.com');
            });
        });
        describe('Fallback to storage', function () {
            var mockHttp;
            var mockStorage;
            beforeEach(function () {
                mockHttp = {
                    get: function (url) {
                        return rxjs_1.Observable.throw(new Error('HTTP Failed'));
                    }
                };
                mockStorage = {
                    get: function (key) {
                        return Promise.resolve(JSON.stringify({
                            ios: {
                                minimum: '1.0.0',
                                latest: '2.4.5',
                                enabled: true,
                                url: 'http://storage.example.com'
                            }
                        }));
                    },
                    set: function (key, value) {
                        return Promise.resolve();
                    }
                };
                spyOn(mockHttp, 'get').and.callThrough();
                spyOn(mockStorage, 'get').and.callThrough();
                spyOn(mockStorage, 'set').and.callThrough();
            });
            it('Should make an http request', function (done) {
                var manup = new manup_service_1.ManUpService(config, mockHttp, null, null, null, null, null, (mockStorage));
                manup.metadata().then(function (data) {
                    expect(mockHttp.get).toHaveBeenCalled();
                    done();
                });
            });
            it('Should fallback to storage', function (done) {
                var manup = new manup_service_1.ManUpService(config, mockHttp, null, null, null, null, null, (mockStorage));
                manup.metadata().then(function (data) {
                    expect(mockStorage.get).toHaveBeenCalled();
                    done();
                });
            });
            it('Should return json', function (done) {
                var manup = new manup_service_1.ManUpService(config, mockHttp, null, null, null, null, null, (mockStorage));
                manup.metadata().then(function (data) {
                    expect(data.ios).toBeDefined();
                    expect(data.ios.url).toBe('http://storage.example.com');
                    done();
                });
            });
        });
    });
    describe('metadataFromStorage', function () {
        it('Should return data from storage, if it exists', function (done) {
            var metadata = {
                ios: { minimum: '1.0.0', latest: '2.0.0', enabled: true, url: 'test.example.com' }
            };
            var mockStorage = {
                get: function (key) {
                    return Promise.resolve(JSON.stringify(metadata));
                }
            };
            spyOn(mockStorage, 'get').and.callThrough();
            var manup = new manup_service_1.ManUpService(null, null, null, null, null, null, null, mockStorage);
            manup.metadataFromStorage().then(function (data) {
                expect(mockStorage.get).toHaveBeenCalledWith('com.nextfaze.ionic-manup.manup');
                expect(data).toEqual(metadata);
                done();
            });
        });
        it('Should error if data is not stored ', function (done) {
            var mockStorage = {
                get: function (key) {
                    return Promise.reject(new Error('not found'));
                }
            };
            spyOn(mockStorage, 'get').and.callThrough();
            var manup = new manup_service_1.ManUpService(null, null, null, null, null, null, null, mockStorage);
            manup.metadataFromStorage().then(function (data) {
                expect(true).toBe(false);
            }, function (error) {
                expect(error).toBeDefined();
                done();
            });
        });
        it('Should throw an exception if storage not configured', function (done) {
            var manup = new manup_service_1.ManUpService(null, null, null, null, null, null, null, null);
            expect(function () {
                manup.metadataFromStorage();
            }).toThrowError();
            done();
        });
    });
    describe('saveMetaData', function () {
        var mockStorage = {
            set: function (key, value) {
                return Promise.resolve();
            }
        };
        it('Should save the item if storage configured', function (done) {
            spyOn(mockStorage, 'set').and.callThrough();
            var manup = new manup_service_1.ManUpService(null, null, null, null, null, null, null, mockStorage);
            var metadata = {
                ios: { minimum: '1.0.0', latest: '2.0.0', enabled: true, url: 'test.example.com' }
            };
            manup.saveMetadata(metadata).then(function () {
                expect(mockStorage.set).toHaveBeenCalledWith('com.nextfaze.ionic-manup.manup', JSON.stringify(metadata));
                done();
            });
        });
        it('Should throw an exception if storage not configured', function (done) {
            var metadata = {
                ios: { minimum: '1.0.0', latest: '2.0.0', enabled: true, url: 'test.example.com' }
            };
            var manup = new manup_service_1.ManUpService(null, null, null, null, null, null, null, null);
            expect(function () {
                manup.saveMetadata(metadata);
            }).toThrowError();
            done();
        });
    });
    describe('getPlatformData', function () {
        var json = {
            ios: {
                minimum: '1.0.0',
                latest: '2.4.5',
                enabled: true,
                url: 'http://example.com'
            },
            android: {
                minimum: '4.0.1',
                latest: '6.2.1',
                enabled: true,
                url: 'http://example.com'
            },
            windows: {
                minimum: '1.0.0',
                latest: '1.0.1',
                enabled: false,
                url: 'http://example.com'
            }
        };
        it('should return IOS metadata if platform is ios', function () {
            var mockPlatform = {
                is: function (v) {
                    return v === 'ios';
                }
            };
            var manup = new manup_service_1.ManUpService(null, null, null, mockPlatform, null, null, null, null);
            var result = manup.getPlatformData(json);
            expect(result).toEqual(json.ios);
        });
        it('should return android metadata if platform is android', function () {
            var mockPlatform = {
                is: function (v) {
                    return v === 'android';
                }
            };
            var manup = new manup_service_1.ManUpService(null, null, null, mockPlatform, null, null, null, null);
            var result = manup.getPlatformData(json);
            expect(result).toEqual(json.android);
        });
        it('should return windows metadata if platform is windows', function () {
            var mockPlatform = {
                is: function (v) {
                    return v === 'desktop';
                }
            };
            var manup = new manup_service_1.ManUpService(null, null, null, mockPlatform, null, null, null, null);
            var result = manup.getPlatformData(json);
            expect(result).toEqual(json.windows);
        });
        it('should throw and error if the platform is unsupported', function () {
            var mockPlatform = {
                is: function (v) {
                    return false;
                }
            };
            var manup = new manup_service_1.ManUpService(null, null, null, mockPlatform, null, null, null, null);
            expect(function () {
                manup.getPlatformData(json);
            }).toThrow();
        });
        it('should throw and error invalid metadata is passed in', function () {
            var mockPlatform = {
                is: function (v) {
                    return false;
                }
            };
            var manup = new manup_service_1.ManUpService(null, null, null, mockPlatform, null, null, null, null);
            expect(function () {
                manup.getPlatformData(null);
            }).toThrow();
        });
    });
});
//# sourceMappingURL=manup.service.spec.js.map