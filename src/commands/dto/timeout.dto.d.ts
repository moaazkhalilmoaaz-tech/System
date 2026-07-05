import { GuildMember } from 'discord.js';
export declare class TimeoutDto {
    member: GuildMember;
    duration: string;
    reason: string;
}
