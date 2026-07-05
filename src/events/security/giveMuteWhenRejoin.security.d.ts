import { Repository } from 'typeorm';
import { Mute } from './../../database/entities/mute.entity';
export declare class GiveMuteWhenRejoinService {
    private muteRepository;
    private readonly logger;
    constructor(muteRepository: Repository<Mute>);
    private readonly MEMBER_ROLE_ID;
    private readonly BOT_ROLE_ID;
    onMemberJoin([member]: [any]): Promise<void>;
}
