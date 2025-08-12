import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { estheticianId, serviceName, dateTime, notes } = body;

    // --- TEMPORARY: Hardcode client until auth is implemented ---
    const firstClient = await prisma.client.findFirst({
        // Adding an orderby to ensure we get a consistent client
        orderBy: {
            createdAt: 'asc',
        }
    });
    if (!firstClient) {
      return NextResponse.json({ message: 'No clients found in the database to book with. Please seed the database.' }, { status: 400 });
    }
    const clientId = firstClient.id;
    // --- END TEMPORARY ---

    // Basic validation
    if (!estheticianId || !serviceName || !dateTime) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Find the service to get its ID, as the client only knows the name
    const service = await prisma.service.findFirst({
        where: {
          name: serviceName,
          estheticianId: estheticianId,
        }
    });

    if (!service) {
        return NextResponse.json({ message: `Service "${serviceName}" not found for this esthetician.` }, { status: 404 });
    }

    const newAppointment = await prisma.appointment.create({
      data: {
        estheticianId,
        serviceId: service.id, // Use the looked-up service ID
        clientId,
        dateTime: new Date(dateTime), // Ensure dateTime is a Date object
        notes,
        status: 'PENDING', // Default status
        paymentStatus: 'UNPAID', // Default status
        location: 'IN_SALON', // Default location for now
      },
    });

    return NextResponse.json(newAppointment, { status: 201 });
  } catch (error) {
    console.error('Failed to create appointment:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Failed to create appointment', error: errorMessage }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
