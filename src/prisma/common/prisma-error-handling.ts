import { Prisma } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

export function handlePrismaError(error: unknown, resourceName: string) {
  const notFoundCodeError = 'P2025';
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === notFoundCodeError
  ) {
    throw new NotFoundException(`${resourceName} not found'`);
  }

  throw error;
}
