export declare class Ban {
    id: number;
    guildId: string;
    member: string;
    by: string;
    reason: string;
    time: Date;
    punishTime: {
        unit: string;
        amount: number;
    };
    createdAt: Date;
    updatedAt: Date;
}
