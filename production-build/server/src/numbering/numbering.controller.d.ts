import { NumberingService } from './numbering.service';
import { GenerateFolioDto } from './dto/generate-folio.dto';
export declare class NumberingController {
    private readonly numberingService;
    constructor(numberingService: NumberingService);
    generateFolio(dto: GenerateFolioDto): Promise<{
        folio: string;
    }>;
}
