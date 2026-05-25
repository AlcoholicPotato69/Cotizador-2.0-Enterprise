import { DocumentsService } from './documents.service';
export declare class DocumentsController {
    private readonly documentsService;
    constructor(documentsService: DocumentsService);
    generatePdf(user: any, dto: {
        documentId: string;
        templateId: string;
        data: any;
    }): Promise<{
        documentId: string;
        url: string;
        status: string;
    }>;
}
