import { PrismaClient } from '@prisma/client';

// PrismaClientのグローバルシングルトンインスタンスを作成
// これによりホットリロード時に複数のインスタンスが作成されるのを防ぐ
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
