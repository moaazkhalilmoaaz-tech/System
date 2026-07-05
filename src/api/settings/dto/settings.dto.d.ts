export declare class TaxConfigDto {
    taxPercengage: number;
    taxFixed: number;
    taxReciever: string;
}
export declare class EconomyRoleDto {
    roleId: string;
    permissions: string[];
}
export declare class EconomyConfigDto {
    tax: TaxConfigDto;
    allowedRoles: EconomyRoleDto[];
}
export declare class PunishmentReasonDto {
    text: string;
    time: number | string;
    unit: string;
}
export declare class CommandItemDto {
    name: string;
    enabled: boolean;
    aliases: string[];
    allowedRoles: string[];
    deniedRoles: string[];
    allowedChannels: string[];
    deniedChannels: string[];
    defaultAction: string;
    specificTime: number | string;
    specificUnit: string;
    reasons: PunishmentReasonDto[];
}
export declare class AutoLineDto {
    enabled: boolean;
    imageUrl: string;
    channels: string[];
}
export declare class EmbedConfigDto {
    title: string;
    color: string;
    image: string;
}
export declare class ReplyItemDto {
    trigger: string;
    response: string;
    wildcard: boolean;
    replyToUser: boolean;
    isEmbed: boolean;
    embed: EmbedConfigDto;
    allowedRoles: string[];
    disabledRoles: string[];
    allowedChannels: string[];
    disabledChannels: string[];
}
export declare class AutoReplyDto {
    enabled: boolean;
    replies: ReplyItemDto[];
}
export declare class ReactItemDto {
    channelId: string;
    emojis: string[];
}
export declare class AutoReactDto {
    enabled: boolean;
    channels: ReactItemDto[];
}
export declare class LevelingConfigDto {
    enabled: boolean;
    channelId: string;
    statsChannelId: string;
}
export declare class SettingsDto {
    guildId: string;
    prefix: string;
    embedColor: string;
    owners: string[];
    blacklistRole: string;
    allowedChannels: string[];
    economy: EconomyConfigDto;
    autoLine: AutoLineDto;
    autoReply: AutoReplyDto;
    autoReact: AutoReactDto;
    commands: CommandItemDto[];
    leveling: LevelingConfigDto;
}
