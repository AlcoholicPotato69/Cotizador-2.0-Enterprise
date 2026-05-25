export declare class CreateRegulationDto {
    title: string;
    content: string;
    version?: string;
}
export declare class AcceptRegulationDto {
    regulationId: string;
    acceptedBy: string;
    ipAddress: string;
    userAgent?: string;
    version: string;
}
