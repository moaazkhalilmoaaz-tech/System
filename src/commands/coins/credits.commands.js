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
exports.CreditsCommand = void 0;
const common_1 = require("@nestjs/common");
const necord_1 = require("necord");
const discord_js_1 = require("discord.js");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const credits_dto_1 = require("./../dto/credits.dto");
const credit_entity_1 = require("../../database/entities/credit.entity");
const canvas_1 = require("@napi-rs/canvas");
const settings_service_1 = require("./../../api/settings/settings.service");
let CreditsCommand = class CreditsCommand {
    creditRepository;
    settingService;
    constructor(creditRepository, settingService) {
        this.creditRepository = creditRepository;
        this.settingService = settingService;
    }
    async onSlash([interaction], { user, amount }) {
        if (!interaction.guildId)
            return;
        const settings = await this.settingService.getGuildSettings(interaction.guildId);
        if (!settings)
            return;
        if (this.isNotAllowed(interaction.channel, interaction.member, settings)) {
            return interaction.reply({
                content: 'غير مصرح لك باستخدام الأمر هنا أو ليس لديك الصلاحية.',
                flags: 64,
            });
        }
        if (user && amount !== null && amount !== undefined) {
            return this.handleTransferRequest(interaction, interaction.user, user, amount, settings);
        }
        const targetUser = user || interaction.user;
        const balance = await this.getUserBalance(targetUser.id);
        return interaction.reply({
            content: `<@${targetUser.id}>, رصيد حسابه هو \`${balance}$\` من الـ Royals.`,
        });
    }
    async onText([message], args) {
        if (!message.guildId)
            return;
        const settings = await this.settingService.getGuildSettings(message.guildId);
        if (!settings)
            return;
        if (!message.member ||
            this.isNotAllowed(message.channel, message.member, settings))
            return;
        const [targetIdentifier, amountString] = args;
        let targetUser;
        let transferAmount = null;
        if (targetIdentifier) {
            if (message.mentions.users.size > 0 &&
                targetIdentifier.startsWith('<@')) {
                targetUser = message.mentions.users.first();
            }
            else if (!isNaN(Number(targetIdentifier)) &&
                targetIdentifier.length > 15) {
                try {
                    targetUser = await message.client.users.fetch(targetIdentifier);
                }
                catch {
                    ;
                }
            }
        }
        if (amountString && !isNaN(parseInt(amountString))) {
            transferAmount = parseInt(amountString);
        }
        if (targetUser && transferAmount !== null) {
            return this.handleTransferRequest(message, message.author, targetUser, transferAmount, settings);
        }
        const userToView = targetUser || message.author;
        const balance = await this.getUserBalance(userToView.id);
        return message.reply(`<@${userToView.id}>, رصيد حسابه هو \`${balance}$\` من الـ Royals.`);
    }
    generateCaptcha() {
        const width = 320;
        const height = 100;
        const canvas = (0, canvas_1.createCanvas)(width, height);
        const ctx = canvas.getContext('2d');
        const code = Math.floor(10000 + Math.random() * 90000).toString();
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, '#111827');
        gradient.addColorStop(1, '#1f2937');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        ctx.font = 'bold 55px Arial';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        const totalTextWidth = 200;
        const startX = (width - totalTextWidth) / 2 + 20;
        const spacing = 45;
        for (let i = 0; i < code.length; i++) {
            ctx.save();
            const x = startX + i * spacing;
            const y = height / 2;
            ctx.translate(x, y);
            const angle = (Math.random() - 0.5) * 0.3;
            ctx.rotate(angle);
            ctx.shadowColor = 'rgba(0,0,0,0.8)';
            ctx.shadowBlur = 8;
            ctx.shadowOffsetX = 4;
            ctx.shadowOffsetY = 4;
            ctx.fillStyle = '#f3f4f6';
            ctx.fillText(code[i], 0, 0);
            ctx.restore();
        }
        ctx.lineWidth = 2;
        for (let i = 0; i < 7; i++) {
            ctx.beginPath();
            ctx.strokeStyle =
                Math.random() > 0.5
                    ? 'rgba(255,255,255,0.2)'
                    : 'rgba(59, 130, 246, 0.3)';
            const startLineX = Math.random() * width;
            const startLineY = Math.random() * height;
            ctx.moveTo(startLineX, startLineY);
            ctx.lineTo(startLineX + Math.random() * 100 - 50, startLineY + Math.random() * 50 - 25);
            ctx.stroke();
        }
        for (let i = 0; i < 30; i++) {
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.2})`;
            ctx.beginPath();
            ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 2, 0, Math.PI * 2);
            ctx.fill();
        }
        return { code, buffer: canvas.toBuffer('image/png') };
    }
    async handleTransferRequest(context, sender, receiver, amount, settings) {
        const member = context.member;
        const allowedRoles = ['1439224825494245460', '1471142242260488203'];
        const owners = Array.isArray(settings?.owners) ? settings.owners.map((o) => String(o).trim()) : [];
        const isOwnerOrAdmin = owners.includes(sender.id) ||
            context.guild?.ownerId === sender.id ||
            member?.permissions.has(discord_js_1.PermissionsBitField.Flags.Administrator);
        const hasAllowedRole = member?.roles.cache.some(role => allowedRoles.includes(role.id));
        if (!isOwnerOrAdmin && !hasAllowedRole) {
            return this.reply(context, 'عذراً، لا يمكنك التحويل. فقط رتب معينة والمسؤولين لديهم هذه الصلاحية.');
        }
        if (receiver.bot)
            return this.reply(context, 'لا يمكن تحويل الرصيد إلى بوت.');
        if (receiver.id === sender.id)
            return this.reply(context, 'لا يمكنك تحويل الرصيد إلى نفسك.');
        if (amount <= 0)
            return this.reply(context, 'الرجاء إدخال مبلغ صحيح.');
        const senderData = await this.creditRepository.findOne({ where: { userId: sender.id } });
        if (!senderData || senderData.credit < amount) {
            return this.reply(context, `رصيدك غير كافٍ. رصيدك الحالي: ${senderData?.credit || 0}`);
        }
        const { code, buffer } = this.generateCaptcha();
        const attachment = new discord_js_1.AttachmentBuilder(buffer, { name: 'captcha.png' });
        const msg = await this.reply(context, {
            content: `**${sender.username}**, يرجى كتابة الرقم الظاهر في الصورة لإتمام التحويل.`,
            files: [attachment],
            withResponse: true
        });
        const channel = context.channel;
        if (!channel)
            return;
        const filter = (m) => m.author.id === sender.id && !m.author.bot;
        const collector = channel.createMessageCollector({
            filter,
            time: 30000,
            max: 1,
        });
        collector.on('collect', async (m) => {
            if (m.content === code) {
                const result = await this.finalizeTransfer(sender, receiver, amount, settings);
                await m.reply(result);
            }
            else {
                await m.reply('الكود غير صحيح، تم إلغاء العملية.');
            }
            collector.emit("end");
        });
        collector.on("end", async () => {
            if (context instanceof discord_js_1.ChatInputCommandInteraction) {
                await context.deleteReply().catch(() => { });
            }
            else {
                await msg.delete().catch(() => { });
            }
        });
    }
    async finalizeTransfer(sender, receiver, amount, settings) {
        const senderData = await this.creditRepository.findOne({ where: { userId: sender.id } });
        if (!senderData || (senderData?.credit ?? 0) < amount) {
            return 'رصيدك غير كافٍ لإجراء هذا التحويل.';
        }
        const taxPercent = settings.economy?.tax?.taxPercengage || 0;
        const taxFixed = settings.economy?.tax?.taxFixed || 0;
        const totalTax = Math.floor(amount * (taxPercent / 100) + taxFixed);
        const netAmountReceived = amount - totalTax;
        if (netAmountReceived < 0)
            return 'المبلغ قليل جداً لتغطية الضرائب.';
        let receiverData = await this.creditRepository.findOne({ where: { userId: receiver.id } });
        if (!receiverData) {
            receiverData = this.creditRepository.create({ userId: receiver.id, credit: 0 });
        }
        senderData.credit -= amount;
        receiverData.credit += netAmountReceived;
        await this.creditRepository.save([senderData, receiverData]);
        const taxReceiverId = settings.economy?.tax?.taxReciever;
        if (taxReceiverId != receiverData.userId && taxReceiverId && totalTax > 0) {
            let taxReceiverData = await this.creditRepository.findOne({ where: { userId: taxReceiverId } });
            if (!taxReceiverData) {
                taxReceiverData = this.creditRepository.create({ userId: taxReceiverId, credit: totalTax });
            }
            else {
                taxReceiverData.credit += totalTax;
            }
            await this.creditRepository.save(taxReceiverData);
        }
        return `✅ تم تحويل \`${netAmountReceived}$\` من <@${sender.id}> إلى <@${receiver.id}> (الضريبة: \`${totalTax}$\`).`;
    }
    async getUserBalance(userId) {
        let data = await this.creditRepository.findOne({ where: { userId } });
        if (!data) {
            data = this.creditRepository.create({ userId, credit: 0, isSynced: false });
        }
        if (!data.isSynced) {
            try {
                const response = await fetch(`http://23.109.46.81:25675/credits/${userId}`, {
                    headers: {
                        'token': 'wj9eDsB7mHcEqe9QMc6gN7amFsW'
                    }
                });
                if (response.ok) {
                    const apiData = await response.json();
                    if (apiData.success && apiData.credit && !isNaN(Number(apiData.credit)) && Number(apiData.credit) > 0) {
                        data.credit += Number(apiData.credit);
                    }
                    data.isSynced = true;
                    await this.creditRepository.save(data);
                }
            }
            catch (error) {
                console.error(`[Royals] Failed to sync royals for user ${userId}:`, error);
            }
        }
        return data?.credit ?? 0;
    }
    async reply(context, payload) {
        if (context instanceof discord_js_1.ChatInputCommandInteraction) {
            if (context.deferred || context.replied) {
                return context.followUp(payload);
            }
            return context.reply(payload);
        }
        else {
            return context.reply(payload);
        }
    }
    isNotAllowed(channel, member, settings) {
        const channelId = channel.id;
        const parentId = channel.parentId;
        if (settings.allowedChannels && settings.allowedChannels.length > 0) {
            const isAllowed = settings.allowedChannels.some((id) => id === channelId || (parentId && id === parentId));
            if (!isAllowed)
                return true;
        }
        if (settings.blacklistRole && member.roles.cache.has(settings.blacklistRole)) {
            return true;
        }
        return false;
    }
};
exports.CreditsCommand = CreditsCommand;
__decorate([
    (0, necord_1.SlashCommand)({
        name: 'royals',
        description: 'عرض أو تحويل الرصيد (Royals)',
    }),
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Options)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, credits_dto_1.CreditsDto]),
    __metadata("design:returntype", Promise)
], CreditsCommand.prototype, "onSlash", null);
__decorate([
    (0, necord_1.TextCommand)({
        name: 'royals',
        description: 'عرض أو تحويل الرصيد (Royals)',
    }),
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Arguments)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Array]),
    __metadata("design:returntype", Promise)
], CreditsCommand.prototype, "onText", null);
exports.CreditsCommand = CreditsCommand = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(credit_entity_1.Credit)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        settings_service_1.SettingsService])
], CreditsCommand);
//# sourceMappingURL=credits.commands.js.map