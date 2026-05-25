import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GlobalSearchEngineService {
  constructor(private prisma: PrismaService) {}

  async globalSearch(query: string, tenantId: string) {
    // Busca en todos los snapshots relevantes (clientes, contratos, cotizaciones)
    // convirtiendo el payload JSON a texto y aplicando tsvector.
    const results = await this.prisma.$queryRaw`
      SELECT 
        id, 
        "entity_type", 
        payload,
        ts_rank(
          to_tsvector('spanish', payload::text), 
          plainto_tsquery('spanish', ${query})
        ) AS "relevance"
      FROM "Snapshot"
      WHERE 
        "tenant_id" = ${tenantId} 
        AND to_tsvector('spanish', payload::text) @@ plainto_tsquery('spanish', ${query})
      ORDER BY "relevance" DESC
      LIMIT 50;
    `;

    return results;
  }
}
