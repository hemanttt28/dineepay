const fs = require('fs');

async function testRegister() {
    const url = "http://localhost:3000/api/test";
    let output = `Testing POST to ${url}\n`;

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: "testuser_" + Date.now(), password: "password123" })
        });

        output += `Status: ${res.status}\n`;
        const text = await res.text();
        output += `Response body preview:\n${text.substring(0, 1000)}\n`;

    } catch (e) {
        output += `Fetch failed: ${e.message}\n`;
    }

    fs.writeFileSync('test-output.txt', output);
}

testRegister();
