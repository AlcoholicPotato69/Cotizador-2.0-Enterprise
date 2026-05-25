import { PdfService } from './pdf.service';
export declare class PdfListener {
    private readonly pdfService;
    private readonly logger;
    constructor(pdfService: PdfService);
    handleContractGenerated(event: any): Promise<void>;
    handleAgreementApproved(event: any): Promise<void>;
}
