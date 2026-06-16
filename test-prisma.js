const { PrismaClient } = require('@prisma/client');

async function main() {
    try {
        console.log("Initializing Prisma...");
        const prisma = new PrismaClient();
        console.log("Prisma initialized. Connecting...");
        await prisma.$connect();
        console.log("Connected. Counting users...");
        const count = await prisma.user.count();
        console.log("User count:", count);
        await prisma.$disconnect();
    } catch (e) {
        console.error("Prisma failed:", e);
    }
}

main();
