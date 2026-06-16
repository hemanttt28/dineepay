async function testRegister() {
    const url = "http://localhost:3000/api/register";
    console.log("Testing POST to", url);

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: "testuser_" + Date.now(), password: "password123" })
        });

        console.log("Status:", res.status);
        const text = await res.text();
        console.log("Response body preview:", text.substring(0, 200));

        try {
            console.log("Parsed JSON:", JSON.parse(text));
        } catch (e) {
            console.error("Failed to parse JSON:", e.message);
        }

    } catch (e) {
        console.error("Fetch failed:", e);
    }
}

testRegister();
