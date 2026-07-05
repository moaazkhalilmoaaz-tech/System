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
var AdminPrefixHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminPrefixHandler = void 0;
const common_1 = require("@nestjs/common");
const necord_1 = require("necord");
const discord_js_1 = require("discord.js");
const settings_service_1 = require("./../../api/settings/settings.service");
const permission_utils_1 = require("./../../common/utils/permission.utils");
const avatar_commands_1 = require("../public/avatar.commands");
const user_commands_1 = require("../public/user.commands");
const ban_commands_1 = require("./ban.commands");
const unban_commands_1 = require("./unban.commands");
const kick_commands_1 = require("./kick.commands");
const mute_commands_1 = require("./mute.commands");
const unmute_commands_1 = require("./unmute.commands");
const clear_commands_1 = require("./clear.commands");
const timeout_commands_1 = require("./timeout.commands");
const come_commands_1 = require("./come.commands");
const warn_commands_1 = require("./warn.commands");
const lock_commands_1 = require("./lock.commands");
const unlock_commands_1 = require("./unlock.commands");
const move_commands_1 = require("./move.commands");
const hide_commands_1 = require("./hide.commands");
const show_commands_1 = require("./show.commands");
const say_commands_1 = require("./say.commands");
const embed_commands_1 = require("./embed.commands");
const send_commands_1 = require("./send.commands");
const nickname_commands_1 = require("./nickname.commands");
const untimeout_commands_1 = require("./untimeout.commands");
const warn_remove_commands_1 = require("./warn_remove.commands");
const warnings_commands_1 = require("./warnings.commands");
const credits_commands_1 = require("../coins/credits.commands");
const leaderboard_commands_1 = require("../coins/leaderboard.commands");
const tax_commands_1 = require("../coins/tax.commands");
let AdminPrefixHandler = AdminPrefixHandler_1 = class AdminPrefixHandler {
    client;
    settingsService;
    avatarCommand;
    userCommand;
    banCommand;
    unbanCommand;
    kickCommand;
    muteCommand;
    unmuteCommand;
    clearCommand;
    timeoutCommand;
    warnCommand;
    lockCommand;
    unlockCommand;
    moveCommand;
    hideCommand;
    showCommand;
    sayCommand;
    comeCommand;
    embedCommand;
    sendCommand;
    nicknameCommand;
    untimeoutCommand;
    warnRemoveCommand;
    warningsCommand;
    creditsCommand;
    leaderboardCommand;
    taxCommand;
    logger = new common_1.Logger(AdminPrefixHandler_1.name);
    constructor(client, settingsService, avatarCommand, userCommand, banCommand, unbanCommand, kickCommand, muteCommand, unmuteCommand, clearCommand, timeoutCommand, warnCommand, lockCommand, unlockCommand, moveCommand, hideCommand, showCommand, sayCommand, comeCommand, embedCommand, sendCommand, nicknameCommand, untimeoutCommand, warnRemoveCommand, warningsCommand, creditsCommand, leaderboardCommand, taxCommand) {
        this.client = client;
        this.settingsService = settingsService;
        this.avatarCommand = avatarCommand;
        this.userCommand = userCommand;
        this.banCommand = banCommand;
        this.unbanCommand = unbanCommand;
        this.kickCommand = kickCommand;
        this.muteCommand = muteCommand;
        this.unmuteCommand = unmuteCommand;
        this.clearCommand = clearCommand;
        this.timeoutCommand = timeoutCommand;
        this.warnCommand = warnCommand;
        this.lockCommand = lockCommand;
        this.unlockCommand = unlockCommand;
        this.moveCommand = moveCommand;
        this.hideCommand = hideCommand;
        this.showCommand = showCommand;
        this.sayCommand = sayCommand;
        this.comeCommand = comeCommand;
        this.embedCommand = embedCommand;
        this.sendCommand = sendCommand;
        this.nicknameCommand = nicknameCommand;
        this.untimeoutCommand = untimeoutCommand;
        this.warnRemoveCommand = warnRemoveCommand;
        this.warningsCommand = warningsCommand;
        this.creditsCommand = creditsCommand;
        this.leaderboardCommand = leaderboardCommand;
        this.taxCommand = taxCommand;
    }
    async onMessageCreate([message]) {
        if (message.author.bot || !message.content || !message.guildId)
            return;
        try {
            const settings = await this.settingsService.getGuildSettings(message.guildId);
            const prefix = settings?.prefix || '!';
            const content = message.content.trim();
            const botId = message.client.user?.id;
            const botMention = botId ? `<@${botId}>` : null;
            const botNickMention = botId ? `<@!${botId}>` : null;
            let args = [];
            let usedPrefix = '';
            if (botMention && content.startsWith(botMention)) {
                usedPrefix = botMention;
            }
            else if (botNickMention && content.startsWith(botNickMention)) {
                usedPrefix = botNickMention;
            }
            else if (content.startsWith(prefix)) {
                usedPrefix = prefix;
            }
            else {
                return;
            }
            args = content.slice(usedPrefix.length).trim().split(/ +/g);
            const triggerWord = args.shift()?.toLowerCase() || '';
            if (!triggerWord)
                return;
            const commands = settings?.commands || [];
            for (const cmdConfig of commands) {
                if (cmdConfig.enabled === false)
                    continue;
                const aliases = Array.isArray(cmdConfig.aliases) ? cmdConfig.aliases :
                    (typeof cmdConfig.aliases === 'string' ? cmdConfig.aliases.split(/, */) : []);
                const normalizedAliases = aliases.map(a => a.toLowerCase().trim());
                if (normalizedAliases.includes(triggerWord) || cmdConfig.name.toLowerCase() === triggerWord) {
                    this.logger.debug(`Matched command: ${cmdConfig.name} with trigger: ${triggerWord}`);
                    await this.dispatch(cmdConfig, message, args, settings);
                    return;
                }
            }
        }
        catch (error) {
            this.logger.error(`Error in AdminPrefixHandler: ${error.message}`, error.stack);
        }
    }
    COMMAND_PERMISSIONS = {
        'ban': discord_js_1.PermissionsBitField.Flags.BanMembers,
        'unban': discord_js_1.PermissionsBitField.Flags.BanMembers,
        'kick': discord_js_1.PermissionsBitField.Flags.KickMembers,
        'mute text': discord_js_1.PermissionsBitField.Flags.MuteMembers,
        'mute voice': discord_js_1.PermissionsBitField.Flags.MuteMembers,
        'unmute text': discord_js_1.PermissionsBitField.Flags.MuteMembers,
        'unmute voice': discord_js_1.PermissionsBitField.Flags.MuteMembers,
        'clear': discord_js_1.PermissionsBitField.Flags.ManageMessages,
        'timeout': discord_js_1.PermissionsBitField.Flags.ModerateMembers,
        'warn': discord_js_1.PermissionsBitField.Flags.ModerateMembers,
        'تحذير': discord_js_1.PermissionsBitField.Flags.ModerateMembers,
        'warn_remove': discord_js_1.PermissionsBitField.Flags.ModerateMembers,
        'warnings': discord_js_1.PermissionsBitField.Flags.ModerateMembers,
        'تحذيراتي': discord_js_1.PermissionsBitField.Flags.ModerateMembers,
        'lock': discord_js_1.PermissionsBitField.Flags.ManageChannels,
        'قفل': discord_js_1.PermissionsBitField.Flags.ManageChannels,
        'unlock': discord_js_1.PermissionsBitField.Flags.ManageChannels,
        'فتح': discord_js_1.PermissionsBitField.Flags.ManageChannels,
        'move': discord_js_1.PermissionsBitField.Flags.MoveMembers,
        'سحب': discord_js_1.PermissionsBitField.Flags.MoveMembers,
        'hide': discord_js_1.PermissionsBitField.Flags.ManageChannels,
        'اخفاء': discord_js_1.PermissionsBitField.Flags.ManageChannels,
        'show': discord_js_1.PermissionsBitField.Flags.ManageChannels,
        'اظهار': discord_js_1.PermissionsBitField.Flags.ManageChannels,
        'say': discord_js_1.PermissionsBitField.Flags.Administrator,
        'قول': discord_js_1.PermissionsBitField.Flags.Administrator,
        'embed': discord_js_1.PermissionsBitField.Flags.Administrator,
        'بورد': discord_js_1.PermissionsBitField.Flags.Administrator,
        'send': discord_js_1.PermissionsBitField.Flags.ManageMessages,
        'ارسل': discord_js_1.PermissionsBitField.Flags.ManageMessages,
        'nickname': discord_js_1.PermissionsBitField.Flags.ManageNicknames,
        'لقب': discord_js_1.PermissionsBitField.Flags.ManageNicknames,
        'role': discord_js_1.PermissionsBitField.Flags.ManageRoles,
        'رتبة': discord_js_1.PermissionsBitField.Flags.ManageRoles,
        'come': discord_js_1.PermissionsBitField.Flags.ModerateMembers,
        'تعال': discord_js_1.PermissionsBitField.Flags.ModerateMembers,
        'untimeout': discord_js_1.PermissionsBitField.Flags.ModerateMembers,
        'فك-تايم': discord_js_1.PermissionsBitField.Flags.ModerateMembers,
    };
    async dispatch(config, message, args, settings) {
        const name = config.name.toLowerCase();
        const fallbackPerm = this.COMMAND_PERMISSIONS[name] || 0n;
        const permCheck = await (0, permission_utils_1.checkCommandPermissions)(message, settings, name, fallbackPerm);
        if (!permCheck.allowed) {
            if (permCheck.message) {
                await message.reply(permCheck.message).catch(() => null);
            }
            return;
        }
        const context = [message];
        try {
            switch (name) {
                case 'credits':
                case 'royals':
                    return await this.creditsCommand.onText(context, args);
                case 'tax':
                    return await this.taxCommand.onTextTax(context, args);
                case 'leaderboard':
                    return await this.leaderboardCommand.onText(context);
                case 'ban':
                case 'باند':
                    return await this.banCommand.onBanPrefix(context, args);
                case 'unban':
                case 'فك-باند':
                    return await this.unbanCommand.onUnbanPrefix(context, args);
                case 'kick':
                case 'طرد':
                    return await this.kickCommand.onKickPrefix(context, args);
                case 'mute text':
                case 'سجن':
                    return await this.muteCommand.muteTextPrefix(context, args);
                case 'mute voice':
                case 'اسكات':
                    return await this.muteCommand.muteVoicePrefix(context, args);
                case 'unmute text':
                case 'فك-سجن':
                    return await this.unmuteCommand.unmuteTextPrefix(context, args);
                case 'unmute voice':
                case 'فك-اسكات':
                    return await this.unmuteCommand.unmuteVoicePrefix(context, args);
                case 'clear':
                case 'مسح':
                    return await this.clearCommand.onClearPrefix(context, args);
                case 'timeout':
                case 'اسكات-مؤقت':
                    return await this.timeoutCommand.onTimeoutPrefix(context, args);
                case 'untimeout':
                case 'فك-تايم':
                    return await this.untimeoutCommand.onUntimeoutPrefix(context, args);
                case 'come':
                case 'تعال':
                    return await this.comeCommand.onComePrefix(context, args);
                case 'warn':
                case 'تحذير':
                    return await this.warnCommand.onWarnPrefix(context, args);
                case 'lock':
                case 'قفل':
                    return await this.lockCommand.onLockPrefix(context, args);
                case 'unlock':
                case 'فتح':
                    return await this.unlockCommand.onUnlockPrefix(context, args);
                case 'move':
                case 'سحب':
                    return await this.moveCommand.movePrefix(context, args);
                case 'hide':
                case 'اخفاء':
                    return await this.hideCommand.onHidePrefix(context, args);
                case 'show':
                case 'اظهار':
                    return await this.showCommand.onShowPrefix(context, args);
                case 'say':
                case 'قول':
                    return await this.sayCommand.onSayPrefix(context, args);
                case 'embed':
                case 'بورد':
                    return await this.embedCommand.onEmbedPrefix(context, args);
                case 'send':
                case 'ارسل':
                    return await this.sendCommand.onSendPrefix(context, args);
                case 'nickname':
                case 'لقب':
                    return await this.nicknameCommand.onNicknamePrefix(context, args);
                case 'warn_remove':
                case 'فك-تحذير':
                    return await this.warnRemoveCommand.onWarnRemovePrefix(context, args);
                case 'warnings':
                case 'تحذيراتي':
                    return await this.warningsCommand.onWarningsText(context, args);
                case 'avatar':
                    return await this.avatarCommand.onAvatarPrefix(context, args);
                case 'user':
                    return await this.userCommand.onUserPrefix(context, args);
            }
        }
        catch (err) {
            this.logger.error(`Error dispatching command ${name}: ${err.message}`);
        }
    }
};
exports.AdminPrefixHandler = AdminPrefixHandler;
__decorate([
    (0, necord_1.On)('messageCreate'),
    __param(0, (0, necord_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], AdminPrefixHandler.prototype, "onMessageCreate", null);
exports.AdminPrefixHandler = AdminPrefixHandler = AdminPrefixHandler_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [discord_js_1.Client,
        settings_service_1.SettingsService,
        avatar_commands_1.AvatarCommand,
        user_commands_1.UserCommand,
        ban_commands_1.BanCommand,
        unban_commands_1.UnbanCommand,
        kick_commands_1.KickCommand,
        mute_commands_1.MuteCommands,
        unmute_commands_1.UnmuteCommands,
        clear_commands_1.ClearCommand,
        timeout_commands_1.TimeoutCommand,
        warn_commands_1.WarnCommand,
        lock_commands_1.LockCommand,
        unlock_commands_1.UnlockCommand,
        move_commands_1.MoveCommand,
        hide_commands_1.HideCommand,
        show_commands_1.ShowCommand,
        say_commands_1.SayCommand,
        come_commands_1.ComeCommand,
        embed_commands_1.EmbedCommand,
        send_commands_1.SendCommand,
        nickname_commands_1.NicknameCommand,
        untimeout_commands_1.UntimeoutCommand,
        warn_remove_commands_1.WarnRemoveCommand,
        warnings_commands_1.WarningsCommand,
        credits_commands_1.CreditsCommand,
        leaderboard_commands_1.LeaderboardCommand,
        tax_commands_1.TaxCommand])
], AdminPrefixHandler);
//# sourceMappingURL=admin-prefix.commands.js.map