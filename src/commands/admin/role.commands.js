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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleCommands = void 0;
const necord_1 = require("necord");
const role_decorator_1 = require("./../../common/decorators/role.decorator");
const role_dto_1 = require("../dto/role.dto");
let RoleCommands = class RoleCommands {
    async give([interaction], { user, role }) {
        const role_ = interaction.guild?.roles.cache.get(role.id);
        const member = (await interaction.guild?.members.fetch(user.id)) || user;
        const executor = interaction.member;
        if (!role_) {
            return interaction.reply({
                content: 'No valid roles found',
                flags: 64,
            });
        }
        if (interaction.guild &&
            interaction.guild.ownerId !== executor.id &&
            role_.position >= executor.roles.highest.position) {
            return interaction.reply({
                content: 'You cannot manage a role higher than or equal to your highest role.',
                flags: 64,
            });
        }
        try {
            await member.roles.add(role_);
            await interaction.reply({
                content: `Role \`${role_.name}\` added to ${member.user.tag}`,
            });
        }
        catch {
            if (!interaction.replied) {
                await interaction.reply({
                    content: `Failed to give role. Make sure my role is higher than the target role and I have Manage Roles permission.`,
                    flags: 64,
                });
            }
        }
    }
    async remove([interaction], { user, role }) {
        const role_ = interaction.guild?.roles.cache.get(role.id);
        const member = (await interaction.guild?.members.fetch(user.id)) || user;
        const executor = interaction.member;
        if (!role_) {
            return interaction.reply({
                content: 'No valid role found',
                flags: 64,
            });
        }
        if (interaction.guild &&
            interaction.guild.ownerId !== executor.id &&
            role_.position >= executor.roles.highest.position) {
            return interaction.reply({
                content: 'You cannot manage a role higher than or equal to your highest role.',
                flags: 64,
            });
        }
        try {
            await member.roles.remove(role_);
            await interaction.reply({
                content: `Role \`${role_.name}\` removed from ${member.user.tag}`,
            });
        }
        catch {
            if (!interaction.replied) {
                await interaction.reply({
                    content: `Failed to remove role. Make sure my role is higher than the target role and I have Manage Roles permission.`,
                    flags: 64,
                });
            }
        }
    }
    async manageMultiple([interaction], { give_or_remove, role, target }) {
        if (!interaction.guild) {
            return interaction.reply({ content: 'Guild not found', flags: 64 });
        }
        const role_ = interaction.guild?.roles.cache.get(role.id);
        const executor = interaction.member;
        if (!role_) {
            return interaction.reply({
                content: 'No valid role found',
                flags: 64,
            });
        }
        if (interaction.guild &&
            interaction.guild.ownerId !== executor.id &&
            role_.position >= executor.roles.highest.position) {
            return interaction.reply({
                content: 'You cannot manage a role higher than or equal to your highest role.',
                flags: 64,
            });
        }
        let members = await interaction.guild.members.fetch();
        if (target === 'humans') {
            members = members.filter((m) => !m.user.bot);
        }
        else if (target === 'bots') {
            members = members.filter((m) => m.user.bot);
        }
        if (members.size === 0) {
            return interaction.reply({
                content: 'No members found for this target',
                flags: 64,
            });
        }
        await interaction.reply(`**Process started ....**`);
        let fails = 0;
        for (const member of members.values()) {
            try {
                if (give_or_remove === 'give') {
                    await member.roles.add(role);
                }
                else {
                    await member.roles.remove(role);
                }
            }
            catch {
                fails++;
            }
        }
        await interaction.editReply({
            content: `Roles ${give_or_remove}d successfully, fails = ${fails}.`,
        });
    }
};
exports.RoleCommands = RoleCommands;
__decorate([
    (0, necord_1.Subcommand)({
        name: 'give',
        description: 'Give role to a member',
    }),
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Options)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, role_dto_1.RoleGiveDto]),
    __metadata("design:returntype", Promise)
], RoleCommands.prototype, "give", null);
__decorate([
    (0, necord_1.Subcommand)({
        name: 'remove',
        description: 'Remove role from a member',
    }),
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Options)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, role_dto_1.RoleRemoveDto]),
    __metadata("design:returntype", Promise)
], RoleCommands.prototype, "remove", null);
__decorate([
    (0, necord_1.Subcommand)({
        name: 'roles',
        description: 'Give or remove multiple roles to members',
    }),
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Options)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, role_dto_1.RoleMultiDto]),
    __metadata("design:returntype", Promise)
], RoleCommands.prototype, "manageMultiple", null);
exports.RoleCommands = RoleCommands = __decorate([
    (0, role_decorator_1.RoleCommandDecorator)()
], RoleCommands);
;
//# sourceMappingURL=role.commands.js.map