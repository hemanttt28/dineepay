const fs = require('fs');

async function testRegister() {
    const url = "http://localhost:3000/api/register";
    const uniqueUser = "user_" + Date.now();
    let output = `Testing POST to ${url}\n`;
    output += `Creating user: ${uniqueUser}\n\n`;

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: uniqueUser, password: "password123" })
        });

        output += `Status: ${res.status}\n`;
        const text = await res.text();
        output += `Response body:\n${text}\n`;

    } catch (e) {
        output += `Fetch failed: ${e.message}\n`;
    }

    fs.writeFileSync('test-output.txt', output);
    console.log("Test complete!");
}

testRegister();
