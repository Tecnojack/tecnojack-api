import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service.js';
import type { SequenceGeneratorPort } from '../../domain/providers/sequence-generator.port.js';

@Injectable()
export class PrismaSequenceGenerator implements SequenceGeneratorPort {
  constructor(private readonly prisma: PrismaService) {}

  async nextCode(prefix: string, padLength = 6): Promise<string> {
    const cleanPrefix = prefix.trim().toUpperCase();

    try {
      const result = await this.prisma.$queryRawUnsafe<{ get_next_business_code?: string }[]>(
        `SELECT get_next_business_code($1, $2);`,
        cleanPrefix,
        padLength,
      );

      if (result && result.length > 0 && result[0]?.get_next_business_code) {
        return result[0].get_next_business_code;
      }
    } catch {
      // Fallback if PL/pgSQL function is not yet present in target database schema
    }

    const seqName = `seq_code_${cleanPrefix.toLowerCase()}`;
    await this.prisma.$executeRawUnsafe(
      `CREATE SEQUENCE IF NOT EXISTS "${seqName}" START WITH 1 INCREMENT BY 1;`,
    );

    const result = await this.prisma.$queryRawUnsafe<{ nextval: bigint | string | number }[]>(
      `SELECT nextval('${seqName}');`,
    );

    const nextVal = result[0]?.nextval ?? 1;
    const numStr = nextVal.toString();
    return `${cleanPrefix}-${numStr.padStart(padLength, '0')}`;
  }
}
