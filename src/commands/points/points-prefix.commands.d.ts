import { Message } from 'discord.js';
import { SettingsService } from './../../api/settings/settings.service';
import { NecordPaginationService } from '@necord/pagination';
import { Repository } from 'typeorm';
import { Point } from 'src/database/entities/point.entity';
export declare class PointsPrefixHandler {
    private pointRepository;
    private readonly paginationService;
    private readonly settingService;
    constructor(pointRepository: Repository<Point>, paginationService: NecordPaginationService, settingService: SettingsService);
    onMessageCreate([message]: [Message]): Promise<import("discord.js").OmitPartialGroupDMChannel<Message<boolean>> | undefined>;
    private checkPermissions;
    private handleList;
}
