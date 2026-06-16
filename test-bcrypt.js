const bcrypt = require('bcryptjs');

try {
    console.log("Hashing password...");
    const hash = bcrypt.hashSync("test", 10);
    console.log("Password hashed:", hash);
} catch (e) {
    console.error("Bcrypt failed:", e);
}
