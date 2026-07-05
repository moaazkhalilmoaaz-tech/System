"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleCommandDecorator = void 0;
const necord_1 = require("necord");
exports.RoleCommandDecorator = (0, necord_1.createCommandGroupDecorator)({
    name: 'role',
    description: 'role group',
    dmPermission: false
});
//# sourceMappingURL=role.decorator.js.map