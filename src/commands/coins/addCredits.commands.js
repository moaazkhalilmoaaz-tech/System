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
exports.AddCreditsCommand = void 0;
const common_1 = require("@nestjs/common");
const necord_1 = require("necord");
const discord_js_1 = require("discord.js");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const credit_entity_1 = require("../../database/entities/credit.entity");
const addCredits_dto_1 = require("./../dto/addCredits.dto");
const settings_service_1 = require("./../../api/settings/settings.service");
let AddCreditsCommand = class AddCreditsCommand {
    creditRepository;
    settingService;
    constructor(creditRepository, settingService) {
        this.creditRepository = creditRepository;
        this.settingService = settingService;
    }
    async onAddCredits([interaction], { user, amount }) {
        if (!interaction.guildId)
            return;
        const settings = await this.settingService.getGuildSettings(interaction.guildId);
        if (!settings)
            return;
        return this.execute(interaction, user, amount, settings);
    }
    async onTextAddCredits([message], args) {
        if (!message.guildId)
            return;
        const settings = await this.settingService.getGuildSettings(message.guildId);
        if (!settings)
            return;
        const targetUser = message.mentions.users.first();
        const amountArg = args.find(arg => !arg.startsWith('<@') && !isNaN(parseInt(arg)));
        const amount = amountArg ? parseInt(amountArg) : null;
        if (!targetUser || amount === null) {
            return message.reply("الرجاء استخدام الأمر بالطريقة الصحيحة: `!add-royals @user amount`");
        }
        return this.execute(message, targetUser, amount, settings);
    }
    async execute(context, targetUser, amount, settings) {
        const reply = (content, flags = 64) => {
            if (context instanceof discord_js_1.ChatInputCommandInteraction) {
                return context.reply({ content, flags });
            }
            return context.reply(content);
        };
        if (!context.guild) {
            return reply("هذا الأمر يعمل فقط داخل السيرفرات.");
        }
        const member = context.member;
        const authorId = context instanceof discord_js_1.Message ? context.author.id : context.user.id;
        if (!this.checkPermission(member, authorId, settings)) {
            return reply("لا تمتلك صلاحية استخدام هذا الأمر.");
        }
        if (settings.allowedChannels && !settings.allowedChannels.includes(context.channelId)) {
            return reply("لا يمكن استخدام هذا الامر في هذا الروم");
        }
        if (amount <= 0) {
            return reply("الرجاء ادخال مبلغ صالح (أكبر من 0).");
        }
        let userData = await this.creditRepository.findOne({ where: { userId: targetUser.id } });
        const oldCredit = userData ? userData.credit : 0;
        if (!userData) {
            userData = this.creditRepository.create({ userId: targetUser.id, credit: amount });
        }
        else {
            userData.credit += amount;
        }
        const updatedUser = await this.creditRepository.save(userData);
        const embed = new discord_js_1.EmbedBuilder()
            .setColor('#7c5bbe')
            .setTitle("تمت العملية بنجاح")
            .setDescription(`**لقد تم إضافة الـ Royals إلى حسابك , <@${targetUser.id}>\n` +
            `رصيد السابق : \n` +
            `:bank: | . \`$${oldCredit}\`\n` +
            `رصيد الحالي : \n` +
            `:bank: | . \`$${updatedUser.credit}\`\n` +
            `**`)
            .setFooter({ text: `نشكركم على تعاملكم معنا في سيرفر سكايلز، حظًا موفقًا للجميع` });
        if (context instanceof discord_js_1.ChatInputCommandInteraction) {
            return context.reply({ embeds: [embed] });
        }
        else {
            return context.reply({ embeds: [embed] });
        }
    }
    checkPermission(member, userId, settings) {
        if (settings.owners && settings.owners.includes(userId))
            return true;
        if (!member)
            return false;
        const memberRoles = member.roles.cache;
        if (settings?.economy?.allowedRoles) {
            for (const role of settings.economy.allowedRoles) {
                if (memberRoles.has(role.roleId)) {
                    if (role.permissions.includes("addCredits")) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
};
exports.AddCreditsCommand = AddCreditsCommand;
__decorate([
    (0, necord_1.SlashCommand)({
        name: 'add-royals',
        description: 'إضافة Royals للمستخدم',
    }),
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Options)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, addCredits_dto_1.AddCreditsDto]),
    __metadata("design:returntype", Promise)
], AddCreditsCommand.prototype, "onAddCredits", null);
__decorate([
    (0, necord_1.TextCommand)({
        name: 'add-royals',
        description: 'إضافة Royals للمستخدم',
    }),
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Arguments)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Array]),
    __metadata("design:returntype", Promise)
], AddCreditsCommand.prototype, "onTextAddCredits", null);
exports.AddCreditsCommand = AddCreditsCommand = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(credit_entity_1.Credit)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        settings_service_1.SettingsService])
], AddCreditsCommand);
//# sourceMappingURL=addCredits.commands.js.map