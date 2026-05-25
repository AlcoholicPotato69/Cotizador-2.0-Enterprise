import { Injectable, Logger } from '@nestjs/common';
import { DomainEventPublisher } from '../common/events/domain-event-publisher';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';
import * as puppeteer from 'puppeteer';

export interface GeneratePdfDto {
  tenantId: string;
  templateName: string;
  context: any;
  outputFileName: string;
  regulationId?: string;
  spaceId?: string;
}

@Injectable()
export class PdfService {
  private readonly logger = new Logger(PdfService.name);

  constructor(
    private readonly eventPublisher: DomainEventPublisher,
    private readonly prisma: PrismaService,
  ) {}

  async generatePdfFromView(dto: GeneratePdfDto): Promise<string> {
    this.logger.log(
      `Generating PDF for tenant ${dto.tenantId} using view ${dto.templateName}`,
    );

    // Inject dynamic un-hardcoded content from DB if requested
    const enrichedContext = { ...dto.context };

    if (dto.regulationId) {
      const regulationVersion = await this.prisma.regulationVersion.findFirst({
        where: { regulationId: dto.regulationId, tenantId: dto.tenantId },
        orderBy: { createdAt: 'desc' },
      });
      if (regulationVersion) {
        enrichedContext.reglamentoContent = regulationVersion.content;
      }
    }

    if (dto.spaceId) {
      const space = await this.prisma.space.findUnique({
        where: { id: dto.spaceId },
      });
      if (space) {
        // Assume configB2b can store mapImage or we fall back to a dynamic map URL for the space
        const configB2b = space.configB2b as any;
        enrichedContext.planoGeografico =
          configB2b?.mapImage ||
          `https://maps.enterprise.local/spaces/${space.id}/map.png`;
      }
    }

    const viewsDir = path.join(process.cwd(), 'views');
    const templatePath = path.join(viewsDir, `${dto.templateName}.hbs`);

    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template file not found: ${templatePath}`);
    }

    // Compile template using Handlebars
    const templateHtml = fs.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(templateHtml);
    const htmlContent = template(enrichedContext);

    const pdfPath = path.join(process.cwd(), 'uploads', dto.outputFileName);
    const uploadsDir = path.dirname(pdfPath);
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Use Puppeteer to render the PDF
    let browser;
    try {
      browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      await page.pdf({
        path: pdfPath,
        format: 'A4',
        printBackground: true,
        margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' },
      });
    } finally {
      if (browser) {
        await browser.close();
      }
    }

    this.logger.log(`PDF successfully generated: ${pdfPath}`);

    // Publish event: Document Generated
    await this.eventPublisher.publish({
      eventName: 'document.pdf_generated',
      tenantId: dto.tenantId,
      payload: {
        templateName: dto.templateName,
        filePath: pdfPath,
      },
      timestamp: new Date(),
    });

    return pdfPath;
  }
}
