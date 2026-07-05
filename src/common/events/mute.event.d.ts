export declare class MuteEvent {
    readonly guildId: string;
    readonly userId: string;
    readonly executorId: string;
    readonly duration: number;
    readonly reason: string;
    readonly type: 'text' | 'voice';
    constructor(guildId: string, userId: string, executorId: string, duration: number, reason: string, type: 'text' | 'voice');
}
