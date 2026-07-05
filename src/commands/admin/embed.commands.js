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
exports.EmbedCommand = void 0;
const common_1 = require("@nestjs/common");
const necord_1 = require("necord");
const discord_js_1 = require("discord.js");
let EmbedCommand = class EmbedCommand {
    async onEmbedCommand([interaction]) {
        const modal = new discord_js_1.ModalBuilder()
            .setCustomId('custom-embed-modal')
            .setTitle('Embed Creator');
        const titleInput = new discord_js_1.TextInputBuilder()
            .setCustomId('title')
            .setLabel('Title')
            .setStyle(discord_js_1.TextInputStyle.Short)
            .setRequired(true);
        const descriptionInput = new discord_js_1.TextInputBuilder()
            .setCustomId('description')
            .setLabel('Description')
            .setStyle(discord_js_1.TextInputStyle.Paragraph)
            .setRequired(true);
        const colorInput = new discord_js_1.TextInputBuilder()
            .setCustomId('color')
            .setLabel('Color (Hex)')
            .setStyle(discord_js_1.TextInputStyle.Short)
            .setPlaceholder('#FFFFFF')
            .setRequired(false);
        const imageInput = new discord_js_1.TextInputBuilder()
            .setCustomId('image')
            .setLabel('Image URL')
            .setStyle(discord_js_1.TextInputStyle.Short)
            .setRequired(false);
        const optionsInput = new discord_js_1.TextInputBuilder()
            .setCustomId('options')
            .setLabel('Thumbnail URL | Show Time? (yes/no)')
            .setPlaceholder('https://image.png | yes')
            .setStyle(discord_js_1.TextInputStyle.Short)
            .setRequired(false);
        const rows = [
            titleInput,
            descriptionInput,
            colorInput,
            imageInput,
            optionsInput,
        ].map((input) => new discord_js_1.ActionRowBuilder().addComponents(input));
        modal.addComponents(...rows);
        await interaction.showModal(modal);
    }
    async onModalSubmit([interaction]) {
        const title = interaction.fields.getTextInputValue('title');
        const description = interaction.fields.getTextInputValue('description');
        const color = interaction.fields.getTextInputValue('color');
        const image = interaction.fields.getTextInputValue('image');
        const options = interaction.fields.getTextInputValue('options');
        const embed = this.buildEmbed(title, description, color, image, options);
        const channel = interaction.channel;
        if (channel) {
            try {
                await channel.send({ embeds: [embed] });
            }
            catch (e) {
                return interaction.reply({ content: 'Failed to send embed.', flags: 64 });
            }
            await interaction.reply({
                content: 'Embed sent successfully',
                flags: 64
            });
        }
        else {
            await interaction.reply({ content: 'Could not access channel.', flags: 64 });
        }
    }
    async onEmbedPrefix([message], args) {
        if (!message.member?.permissions.has(discord_js_1.PermissionsBitField.Flags.Administrator))
            return;
        if (args.length === 0) {
            return message.reply('Usage: `prefix embed title | description | [color] | [image_url] | [thumbnail | timestamp]`');
        }
        const content = args.join(' ');
        const parts = content.split('|').map((p) => p.trim());
        if (parts.length < 2) {
            return message.reply('Please provide at least a title and description separated by `|`.');
        }
        const [title, description, color, image, options] = parts;
        const embed = this.buildEmbed(title, description, color, image, options);
        const channel = message.channel;
        return channel.send({ embeds: [embed] });
    }
    buildEmbed(title, description, color, image, options) {
        const embed = new discord_js_1.EmbedBuilder().setTitle(title).setDescription(description);
        if (color && /^#[0-9A-F]{6}$/i.test(color)) {
            embed.setColor(color);
        }
        else {
            embed.setColor("#7c5bbe");
        }
        if (image)
            embed.setImage(image);
        if (options) {
            if (/yes|y|true/i.test(options)) {
                embed.setTimestamp();
            }
            const urlMatch = options.match(/(https?:\/\/[^\s,]+)/);
            if (urlMatch)
                embed.setThumbnail(urlMatch[0]);
        }
        return embed;
    }
};
exports.EmbedCommand = EmbedCommand;
__decorate([
    (0, necord_1.SlashCommand)({
        name: 'embed',
        description: 'Create a custom embed message via modal',
    }),
    __param(0, (0, necord_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], EmbedCommand.prototype, "onEmbedCommand", null);
__decorate([
    (0, necord_1.Modal)('custom-embed-modal'),
    __param(0, (0, necord_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], EmbedCommand.prototype, "onModalSubmit", null);
__decorate([
    __param(0, (0, necord_1.Context)()),
    __param(1, (0, necord_1.Arguments)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Array]),
    __metadata("design:returntype", Promise)
], EmbedCommand.prototype, "onEmbedPrefix", null);
exports.EmbedCommand = EmbedCommand = __decorate([
    (0, common_1.Injectable)()
], EmbedCommand);
//# sourceMappingURL=embed.commands.js.map