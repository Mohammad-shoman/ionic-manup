"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lang = require(".");
describe('Language files', function () {
    it('Should contain all languages', function () {
        expect(lang.i18n).toBeDefined();
        expect(lang.i18n.en).toBeDefined();
        expect(lang.i18n.it).toBeDefined();
        expect(lang.i18n.es).toBeDefined();
    });
});
//# sourceMappingURL=index.spec.js.map