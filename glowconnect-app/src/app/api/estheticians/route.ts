import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const estheticians = await prisma.esthetician.findMany({
      // Optionally, include related data if needed by the client
      // include: {
      //   services: true,
      //   reviews: true,
      // }
    });
    return NextResponse.json(estheticians);
  } catch (error) {
    console.error('Failed to fetch estheticians:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Failed to fetch estheticians', error: errorMessage }, { status: 500 });
  } finally {
    // In a real app, you would manage the Prisma client connection more carefully
    // for performance in a serverless environment.
    await prisma.$disconnect();
  }
}
