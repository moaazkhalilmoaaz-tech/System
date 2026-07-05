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
exports.TaxCommand = void 0;
const common_1 = require("@nestjs/common");
const necord_1 = require("necord");
const discord_js_1 = require("discord.js");
const tax_dto_1 = require("./../dto/tax.dto");
const settings_service_1 = require("./../../api/settings/settings.service");
let TaxCommand = class TaxCommand {
    settingService;
    constructor(settingService) {
        this.settingService = settingService;
    }
    parseAmount(input) {
        if (!input)
            return 0;
        if (typeof input === 'number')
            return input;
        const str = input.toLowerCase().replace(/,/g, '');
        let multiplier = 1;
        if (str.endsWith('k')) {
            multiplier = 1000;
        }
        else if (str.endsWith('m')) {
            multiplier = 1000000;
        }
        else if (str.endsWith('b')) {
            multiplier = 1000000000;
        }
        const value = parseFloat(str.replace(/[kmb]/g, ''));
        return Math.floor(value * multiplier);
    }
    async onSlashTax([interaction], { amount }) {
        const parsedAmount = this.parseAmount(amount);
        return this.calculateAndReply(interaction, parsedAmount);
    }
    async onTextTax([message], args) {
        if (!args[0]) {
            return message.reply("الرجاء كتابة المبلغ، مثال: `!tax 1000`");
        }
        const parsedAmount = this.parseAmount(args[0]);
        if (!parsedAmount || isNaN(parsedAmount)) {
            return message.reply("الرجاء كتابة المبلغ، مثال: `!tax 1000`");
        }
        return this.calculateAndReply(message, parsedAmount);
    }
    async calculateAndReply(context, amount) {
        if (!context.guildId)
            return;
        const settings = await this.settingService.getGuildSettings(context.guildId);
        if (!settings)
            return;
        if (amount <= 0) {
            const msg = "الرجاء إدخال مبلغ صحيح أكبر من 0.";
            return context instanceof discord_js_1.ChatInputCommandInteraction
                ? context.reply({ content: msg, flags: 64 })
                : context.reply(msg);
        }
        const taxPercent = settings.economy?.tax?.taxPercengage || 0;
        const taxFixed = settings.economy?.tax?.taxFixed || 0;
        const taxValue = Math.floor((amount * (taxPercent / 100)) + taxFixed);
        const amountReceived = amount - taxValue;
        const taxRateDecimal = taxPercent / 100;
        let requiredAmount = 0;
        if (taxRateDecimal < 1) {
            requiredAmount = Math.ceil((amount + taxFixed) / (1 - taxRateDecimal));
        }
        else {
            requiredAmount = 0;
        }
        const mediatorTaxValue = requiredAmount - amount;
        const embed = new discord_js_1.EmbedBuilder()
            .setColor('#7c5bbe')
            .setTitle(`حاسبة الضرائب`)
            .setDescription(`حساب الضريبة للمبلغ: **${amount.toLocaleString()}**`)
            .addFields({
            name: 'الضريبة العادية',
            value: `قيمة الضريبة: \`${taxValue}\`\nسيصل المبلغ: \`${amountReceived.toLocaleString()}\``,
            inline: false
        }, {
            name: 'ضريبتين (عشان يوصل صافي)',
            value: `لازم تحول: \`${requiredAmount.toLocaleString()}\`\nالضريبة هتكون: \`${mediatorTaxValue}\``,
            inline: false
        })
            .setFooter({ text: `نسبة الضريبة: ${taxPercent}% | ضريبة ثابتة: ${taxFixed}` });
        if (context instanceof discord_js_1.ChatInputCommandInteraction) {
            return context.reply({ embeds: [embed] });
        }
        else {
            return context.reply({ embeds: [embed] });
        }
    }
};
exports.TaxCommand = TaxCommand;
__decorate([
    (0, necord_1.SlashCommand)({
        name: 'tax',
        description: 'حساب ضريبة التحويل',
    }),
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Options)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, tax_dto_1.TaxDto]),
    __metadata("design:returntype", Promise)
], TaxCommand.prototype, "onSlashTax", null);
__decorate([
    (0, necord_1.TextCommand)({
        name: 'tax',
        description: 'حساب ضريبة التحويل',
    }),
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Arguments)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Array]),
    __metadata("design:returntype", Promise)
], TaxCommand.prototype, "onTextTax", null);
exports.TaxCommand = TaxCommand = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [settings_service_1.SettingsService])
], TaxCommand);
//# sourceMappingURL=tax.commands.js.map