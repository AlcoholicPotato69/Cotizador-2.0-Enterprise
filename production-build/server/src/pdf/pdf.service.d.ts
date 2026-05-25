import { DomainEventPublisher } from '../common/events/domain-event-publisher';
import { PrismaService } from '../prisma/prisma.service';
export interface GeneratePdfDto {
    tenantId: string;
    templateName: string;
    context: any;
    outputFileName: string;
    regulationId?: string;
    spaceId?: string;
}
export declare class PdfService {
    private readonly eventPublisher;
    private readonly prisma;
    private readonly logger;
    constructor(eventPublisher: DomainEventPublisher, prisma: PrismaService);
    generatePdfFromView(dto: GeneratePdfDto): Promise<string>;
}
