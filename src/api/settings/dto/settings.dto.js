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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsDto = exports.LevelingConfigDto = exports.AutoReactDto = exports.ReactItemDto = exports.AutoReplyDto = exports.ReplyItemDto = exports.EmbedConfigDto = exports.AutoLineDto = exports.CommandItemDto = exports.PunishmentReasonDto = exports.EconomyConfigDto = exports.EconomyRoleDto = exports.TaxConfigDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class TaxConfigDto {
    taxPercengage;
    taxFixed;
    taxReciever;
}
exports.TaxConfigDto = TaxConfigDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], TaxConfigDto.prototype, "taxPercengage", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], TaxConfigDto.prototype, "taxFixed", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TaxConfigDto.prototype, "taxReciever", void 0);
class EconomyRoleDto {
    roleId;
    permissions;
}
exports.EconomyRoleDto = EconomyRoleDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EconomyRoleDto.prototype, "roleId", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], EconomyRoleDto.prototype, "permissions", void 0);
class EconomyConfigDto {
    tax;
    allowedRoles;
}
exports.EconomyConfigDto = EconomyConfigDto;
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => TaxConfigDto),
    __metadata("design:type", TaxConfigDto)
], EconomyConfigDto.prototype, "tax", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => EconomyRoleDto),
    __metadata("design:type", Array)
], EconomyConfigDto.prototype, "allowedRoles", void 0);
class PunishmentReasonDto {
    text;
    time;
    unit;
}
exports.PunishmentReasonDto = PunishmentReasonDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PunishmentReasonDto.prototype, "text", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], PunishmentReasonDto.prototype, "time", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PunishmentReasonDto.prototype, "unit", void 0);
class CommandItemDto {
    name;
    enabled;
    aliases;
    allowedRoles;
    deniedRoles;
    allowedChannels;
    deniedChannels;
    defaultAction;
    specificTime;
    specificUnit;
    reasons;
}
exports.CommandItemDto = CommandItemDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CommandItemDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CommandItemDto.prototype, "enabled", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CommandItemDto.prototype, "aliases", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CommandItemDto.prototype, "allowedRoles", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CommandItemDto.prototype, "deniedRoles", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CommandItemDto.prototype, "allowedChannels", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CommandItemDto.prototype, "deniedChannels", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CommandItemDto.prototype, "defaultAction", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CommandItemDto.prototype, "specificTime", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CommandItemDto.prototype, "specificUnit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PunishmentReasonDto),
    __metadata("design:type", Array)
], CommandItemDto.prototype, "reasons", void 0);
class AutoLineDto {
    enabled;
    imageUrl;
    channels;
}
exports.AutoLineDto = AutoLineDto;
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AutoLineDto.prototype, "enabled", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AutoLineDto.prototype, "imageUrl", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], AutoLineDto.prototype, "channels", void 0);
class EmbedConfigDto {
    title;
    color;
    image;
}
exports.EmbedConfigDto = EmbedConfigDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EmbedConfigDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EmbedConfigDto.prototype, "color", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EmbedConfigDto.prototype, "image", void 0);
class ReplyItemDto {
    trigger;
    response;
    wildcard;
    replyToUser;
    isEmbed;
    embed;
    allowedRoles;
    disabledRoles;
    allowedChannels;
    disabledChannels;
}
exports.ReplyItemDto = ReplyItemDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReplyItemDto.prototype, "trigger", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReplyItemDto.prototype, "response", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ReplyItemDto.prototype, "wildcard", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ReplyItemDto.prototype, "replyToUser", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ReplyItemDto.prototype, "isEmbed", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => EmbedConfigDto),
    __metadata("design:type", EmbedConfigDto)
], ReplyItemDto.prototype, "embed", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], ReplyItemDto.prototype, "allowedRoles", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], ReplyItemDto.prototype, "disabledRoles", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], ReplyItemDto.prototype, "allowedChannels", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], ReplyItemDto.prototype, "disabledChannels", void 0);
class AutoReplyDto {
    enabled;
    replies;
}
exports.AutoReplyDto = AutoReplyDto;
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AutoReplyDto.prototype, "enabled", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ReplyItemDto),
    __metadata("design:type", Array)
], AutoReplyDto.prototype, "replies", void 0);
class ReactItemDto {
    channelId;
    emojis;
}
exports.ReactItemDto = ReactItemDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReactItemDto.prototype, "channelId", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], ReactItemDto.prototype, "emojis", void 0);
class AutoReactDto {
    enabled;
    channels;
}
exports.AutoReactDto = AutoReactDto;
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AutoReactDto.prototype, "enabled", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ReactItemDto),
    __metadata("design:type", Array)
], AutoReactDto.prototype, "channels", void 0);
class LevelingConfigDto {
    enabled;
    channelId;
    statsChannelId;
}
exports.LevelingConfigDto = LevelingConfigDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], LevelingConfigDto.prototype, "enabled", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LevelingConfigDto.prototype, "channelId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LevelingConfigDto.prototype, "statsChannelId", void 0);
class SettingsDto {
    guildId;
    prefix;
    embedColor;
    owners;
    blacklistRole;
    allowedChannels;
    economy;
    autoLine;
    autoReply;
    autoReact;
    commands;
    leveling;
}
exports.SettingsDto = SettingsDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SettingsDto.prototype, "guildId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SettingsDto.prototype, "prefix", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SettingsDto.prototype, "embedColor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], SettingsDto.prototype, "owners", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SettingsDto.prototype, "blacklistRole", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], SettingsDto.prototype, "allowedChannels", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => EconomyConfigDto),
    __metadata("design:type", EconomyConfigDto)
], SettingsDto.prototype, "economy", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => AutoLineDto),
    __metadata("design:type", AutoLineDto)
], SettingsDto.prototype, "autoLine", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => AutoReplyDto),
    __metadata("design:type", AutoReplyDto)
], SettingsDto.prototype, "autoReply", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => AutoReactDto),
    __metadata("design:type", AutoReactDto)
], SettingsDto.prototype, "autoReact", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CommandItemDto),
    __metadata("design:type", Array)
], SettingsDto.prototype, "commands", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => LevelingConfigDto),
    __metadata("design:type", LevelingConfigDto)
], SettingsDto.prototype, "leveling", void 0);
//# sourceMappingURL=settings.dto.js.map