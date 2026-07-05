import type { SlashCommandContext, TextCommandContext } from 'necord';
import { TimeoutDto } from '../dto/timeout.dto';
import { SettingsService } from '../../api/settings/settings.service';
export declare class TimeoutCommand {
    private readonly settingsService;
    private readonly MAX_TIMEOUT_MS;
    constructor(settingsService: SettingsService);
    onTimeoutSlash([interaction]: SlashCommandContext, { member, duration, reason }: TimeoutDto): Promise<any>;
    onTimeoutPrefix([message]: TextCommandContext, args: string[]): Promise<any>;
    private showReasonMenu;
    private executeTimeout;
}
