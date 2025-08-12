import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const esthetician = await prisma.esthetician.findUnique({
      where: { id },
      include: {
        services: true, // Include the services for the profile page
      },
    });

    if (!esthetician) {
      return NextResponse.json({ message: 'Esthetician not found' }, { status: 404 });
    }

    return NextResponse.json(esthetician);
  } catch (error) {
    console.error(`Failed to fetch esthetician with id ${params.id}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Failed to fetch esthetician', error: errorMessage }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
