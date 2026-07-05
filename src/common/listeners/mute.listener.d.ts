import { Repository } from 'typeorm';
import { Client } from 'discord.js';
import { MuteEvent } from 'src/common/events/mute.event';
import { Mute } from './../../database/entities/mute.entity';
export declare class MuteListener {
    private readonly client;
    private muteRepository;
    private readonly logger;
    constructor(client: Client, muteRepository: Repository<Mute>);
    handleMuteEvent(payload: MuteEvent): Promise<void>;
    checkExpiredMutes(): Promise<void>;
    private getOrCreateMuteRole;
}
