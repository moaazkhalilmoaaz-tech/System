import { Message, VoiceState } from 'discord.js';
import { LevelingService } from './leveling.service';
import { SettingsService } from '../api/settings/settings.service';
export declare class LevelingListener {
    private readonly levelingService;
    private readonly settingsService;
    private voiceSessions;
    constructor(levelingService: LevelingService, settingsService: SettingsService);
    onMessageCreate([message]: [Message]): Promise<import("discord.js").OmitPartialGroupDMChannel<Message<boolean>> | undefined>;
    onVoiceStateUpdate([oldState, newState]: [VoiceState, VoiceState]): Promise<void>;
}
