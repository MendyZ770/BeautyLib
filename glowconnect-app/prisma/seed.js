const { PrismaClient } = require('../node_modules/@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding ...')

  // Create Clients
  await prisma.client.create({
    data: {
      fullName: 'Alice Smith',
      email: 'alice.smith@example.com',
      phone: '123-456-7890',
      loyaltyPoints: 100,
    },
  })

  await prisma.client.create({
    data: {
      fullName: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      phone: '098-765-4321',
    },
  })

  console.log(`Created two clients`)

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
      portfolio: '["/images/portfolio/chloe1.jpg", "/images/portfolio/chloe2.jpg"]',
      certifications: '["Certified Esthetician", "Laser Treatment Specialist"]',
      cityTargeting: '["Paris"]',
    },
  })

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
      portfolio: '["/images/portfolio/sophie1.jpg", "/images/portfolio/sophie2.jpg"]',
      certifications: '["Organic Skincare Diploma"]',
      cityTargeting: '["Paris", "Versailles"]',
    },
  })

  console.log(`Created estheticians: ${esthetician1.fullName}, ${esthetician2.fullName}`)

  // Create Services
  await prisma.service.createMany({
    data: [
      // Services for Chloe
      {
        name: 'Deep Cleansing Facial',
        description: 'A 60-minute deep cleansing facial for all skin types.',
        price: 80,
        estheticianId: esthetician1.id,
      },
      {
        name: 'Microdermabrasion',
        description: 'Mechanical exfoliation to rejuvenate the skin.',
        price: 120,
        estheticianId: esthetician1.id,
      },
      // Services for Sophie
      {
        name: 'Organic Honey Facial',
        description: 'A soothing facial using all-natural honey products.',
        price: 75,
        estheticianId: esthetician2.id,
      },
      {
        name: 'Aromatherapy Massage',
        description: 'A 60-minute relaxing massage with essential oils.',
        price: 90,
        estheticianId: esthetician2.id,
      },
    ],
  })

  console.log('Created services for estheticians.')

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
