import { ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export function handlePrismaError(error: unknown, resourceName: string) {
  const notFoundCodeError = 'P2025';
  const uniqueConstraintKey = 'P2002';

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === notFoundCodeError) {
      throw new NotFoundException(`${resourceName} not found!`);
    }

    if (error.code === uniqueConstraintKey) {
      throw new ConflictException(`${resourceName} already exists!`);
    }
  }

  throw error;
}
