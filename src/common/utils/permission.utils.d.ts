export declare function checkCommandPermissions(context: any, settings: any, commandName: string, fallbackPerm?: bigint): Promise<{
    allowed: boolean;
    message?: string;
}>;
