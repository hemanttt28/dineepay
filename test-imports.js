const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

console.log("Imports successful.");

try {
    console.log("Initializing Prisma...");
    const prisma = new PrismaClient();
    console.log("Prisma initialized.");
} catch (e) {
    console.error("Prisma initialization failed:", e);
}

try {
    console.log("Hashing password...");
    const hash = bcrypt.hashSync("test", 10);
    console.log("Password hashed:", hash);
} catch (e) {
    console.error("Bcrypt failed:", e);
}
