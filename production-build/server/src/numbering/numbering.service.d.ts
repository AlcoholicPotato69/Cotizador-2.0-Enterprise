import { PrismaService } from '../prisma/prisma.service';
import { GenerateFolioDto } from './dto/generate-folio.dto';
export declare class NumberingService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    generateFolio(dto: GenerateFolioDto): Promise<string>;
}
