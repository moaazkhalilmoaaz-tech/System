import type { SlashCommandContext, TextCommandContext } from 'necord';
import { Client } from 'discord.js';
import { MuteTextDto, MuteVoiceDto } from '../dto/mute.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SettingsService } from '../../api/settings/settings.service';
export declare class MuteCommands {
    private readonly eventEmitter;
    private readonly settingsService;
    private readonly client;
    constructor(eventEmitter: EventEmitter2, settingsService: SettingsService, client: Client);
    muteTextSlash([interaction]: SlashCommandContext, options: MuteTextDto): Promise<any>;
    muteVoiceSlash([interaction]: SlashCommandContext, options: MuteVoiceDto): Promise<any>;
    muteTextPrefix([message]: TextCommandContext, args: string[]): Promise<any>;
    muteVoicePrefix([message]: TextCommandContext, args: string[]): Promise<any>;
    private handlePrefixMute;
    private processMute;
    private showReasonMenu;
    private executeMute;
}
