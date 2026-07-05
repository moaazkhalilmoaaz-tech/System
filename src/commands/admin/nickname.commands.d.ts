import type { SlashCommandContext, TextCommandContext } from 'necord';
import { NicknameDto } from '../dto/nickname.dto';
export declare class NicknameCommand {
    onNicknameSlash([interaction]: SlashCommandContext, { member, nickname }: NicknameDto): Promise<import("discord.js").InteractionResponse<boolean> | undefined>;
    onNicknamePrefix([message]: TextCommandContext, args: string[]): Promise<import("discord.js").OmitPartialGroupDMChannel<import("discord.js").Message<boolean>> | undefined>;
}
