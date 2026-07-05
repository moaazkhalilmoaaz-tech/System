import type { SlashCommandContext, ModalContext, TextCommandContext } from 'necord';
export declare class EmbedCommand {
    onEmbedCommand([interaction]: SlashCommandContext): Promise<void>;
    onModalSubmit([interaction]: ModalContext): Promise<import("discord.js").InteractionResponse<boolean> | undefined>;
    onEmbedPrefix([message]: TextCommandContext, args: string[]): Promise<import("discord.js").OmitPartialGroupDMChannel<import("discord.js").Message<boolean>> | import("discord.js").Message<true> | undefined>;
    private buildEmbed;
}
