import { SpaceStatus } from '@prisma/client';
export declare class CreateSpaceDto {
    name: string;
    code?: string;
    capacity: number;
    areaSqm: number;
    basePricePerHour: number;
    configB2b: any;
    preciosPorDia: any;
    diasBloqueados: any[];
    impuestosIds: string[];
    status?: SpaceStatus;
    description: string;
    color?: string;
    tags: any;
    spaceType: string;
    material?: string;
    width?: number;
    height?: number;
    measureUnit?: string;
    location?: string;
    allowsAgreement?: boolean;
    regulationTemplate: string;
    planoPdf: string;
    geographicMap?: string;
    isDigital?: boolean;
    images: any;
}
