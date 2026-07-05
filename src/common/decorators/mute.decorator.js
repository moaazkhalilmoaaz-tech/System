"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MuteCommandDecorator = void 0;
const necord_1 = require("necord");
exports.MuteCommandDecorator = (0, necord_1.createCommandGroupDecorator)({
    name: 'mute',
    description: 'mute group',
    dmPermission: false
});
//# sourceMappingURL=mute.decorator.js.map