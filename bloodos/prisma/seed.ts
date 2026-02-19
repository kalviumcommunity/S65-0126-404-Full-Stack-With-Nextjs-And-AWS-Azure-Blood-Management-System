
import { PrismaClient, BloodType, UserRole } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting seed...')

    // 1. Create Admin
    const admin = await prisma.user.upsert({
        where: { email: 'admin@bloodos.com' },
        update: {},
        create: {
            email: 'admin@bloodos.com',
            password: 'hashed_password_123', // In real app, hash this!
            role: UserRole.ADMIN,
            auditLogs: {
                create: {
                    action: 'SEED',
                    details: 'Initial admin created',
                },
            },
        },
    })
    console.log('✅ Created Admin:', admin.email)

    // 2. Create Donor
    const donor = await prisma.user.upsert({
        where: { email: 'donor@example.com' },
        update: {},
        create: {
            email: 'donor@example.com',
            password: 'hashed_password_123',
            role: UserRole.DONOR,
            donorProfile: {
                create: {
                    fullName: 'John Doe',
                    bloodType: BloodType.O_NEG,
                    phone: '+1234567890',
                    city: 'New York',
                    state: 'NY',
                },
            },
            auditLogs: {
                create: {
                    action: 'SEED',
                    details: 'Initial donor created',
                },
            },
        },
    })
    console.log('✅ Created Donor:', donor.email)

    // 3. Create Hospital
    const hospital = await prisma.user.upsert({
        where: { email: 'hospital@citygeneral.com' },
        update: {},
        create: {
            email: 'hospital@citygeneral.com',
            password: 'hashed_password_123',
            role: UserRole.HOSPITAL,
            hospitalProfile: {
                create: {
                    name: 'City General Hospital',
                    licenseNumber: 'DOC-12345',
                    phone: '+1987654321',
                    address: '123 Health St',
                    city: 'Metropolis',
                    state: 'NY',
                    zipCode: '10001',
                    // Seed inventory for this hospital
                    inventory: {
                        createMany: {
                            data: [
                                { bloodType: BloodType.A_POS, quantity: 10 },
                                { bloodType: BloodType.B_NEG, quantity: 5 },
                                { bloodType: BloodType.O_POS, quantity: 20 },
                            ],
                        },
                    },
                },
            },
        },
    })
    console.log('✅ Created Hospital:', hospital.email)

    console.log('🏁 Seed completed.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
