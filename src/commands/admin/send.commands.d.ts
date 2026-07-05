import type { SlashCommandContext, TextCommandContext } from 'necord';
import { SendDto } from '../dto/send.dto';
export declare class SendCommand {
    onSendSlash([interaction]: SlashCommandContext, { member, message }: SendDto): Promise<import("discord.js").InteractionResponse<boolean> | undefined>;
    onSendPrefix([message]: TextCommandContext, args: string[]): Promise<import("discord.js").OmitPartialGroupDMChannel<import("discord.js").Message<boolean>> | undefined>;
}
