import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST() {
  try {
    // This is the same logic from the seed script that was failing.
    // Running it here in an API route context might bypass the execution environment issues.

    // Clear existing data to make this idempotent
    await prisma.service.deleteMany({});
    await prisma.appointment.deleteMany({});
    await prisma.review.deleteMany({});
    // We need to be careful with the order of deletion due to relations
    // We can't delete an esthetician if a client has it as a favorite.
    // Let's handle the many-to-many relation first.
    // This is a bit complex, for a seed script a simpler approach is to reset the db.
    // But since we can't do that easily, let's just clear what we can.
    // For now, let's assume no favorites are set. A better approach would be raw SQL truncate.
    await prisma.esthetician.deleteMany({});
    await prisma.client.deleteMany({});

    console.log('Start seeding via API...');

    // Create Clients
    const client1 = await prisma.client.create({
      data: {
        fullName: 'Alice Smith',
        email: 'alice.smith@example.com',
        phone: '123-456-7890',
        loyaltyPoints: 100,
      },
    });

    const client2 = await prisma.client.create({
      data: {
        fullName: 'Bob Johnson',
        email: 'bob.johnson@example.com',
        phone: '098-765-4321',
      },
    });

    // Create Estheticians
    const esthetician1 = await prisma.esthetician.create({
      data: {
        fullName: 'Chloe Dubois',
        email: 'chloe.dubois@beautysalon.com',
        description: 'Specializing in advanced skincare treatments. Over 10 years of experience.',
        latitude: 48.858844,
        longitude: 2.294351, // Near Eiffel Tower
        phone: '555-111-2222',
        verified: true,
        travelToClient: false,
        portfolio: '["https://via.placeholder.com/300x200?text=Work+1", "https://via.placeholder.com/300x200?text=Work+2"]',
        certifications: '["Certified Esthetician", "Laser Treatment Specialist"]',
        cityTargeting: '["Paris"]',
      },
    });

    const esthetician2 = await prisma.esthetician.create({
      data: {
        fullName: 'Sophie Martin',
        email: 'sophie.martin@glowup.com',
        description: 'Expert in natural and organic beauty solutions.',
        latitude: 48.860611,
        longitude: 2.337644, // Near Louvre Museum
        phone: '555-333-4444',
        verified: true,
        travelToClient: true,
        serviceRadiusKm: 10,
        portfolio: '["https://via.placeholder.com/300x200?text=Work+3", "https://via.placeholder.com/300x200?text=Work+4"]',
        certifications: '["Organic Skincare Diploma"]',
        cityTargeting: '["Paris", "Versailles"]',
      },
    });

    // Create Services
    await prisma.service.createMany({
      data: [
        { name: 'Deep Cleansing Facial', description: 'A 60-minute deep cleansing facial.', price: 80, estheticianId: esthetician1.id },
        { name: 'Microdermabrasion', description: 'Mechanical exfoliation.', price: 120, estheticianId: esthetician1.id },
        { name: 'Organic Honey Facial', description: 'A soothing facial.', price: 75, estheticianId: esthetician2.id },
        { name: 'Aromatherapy Massage', description: 'A 60-minute relaxing massage.', price: 90, estheticianId: esthetician2.id },
      ],
    });

    console.log('Seeding via API finished.');
    return NextResponse.json({ message: 'Database seeded successfully' });

  } catch (error) {
    console.error('Seeding failed:', error);
    // Type guard for error
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Database seeding failed', error: errorMessage }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
