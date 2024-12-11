const express = require('express');
const fetch = require('node-fetch');
const app = express();

const LOGGLY_TOKEN = process.env.LOGGLY_TOKEN;
const LOGGLY_URL = `https://logs-01.loggly.com/inputs/${LOGGLY_TOKEN}/tag/http/`;

// Middleware to parse JSON requests
app.use(express.json());

// Endpoint to receive logs and forward them to Loggly
app.post('/log', async (req, res) => {
    const logData = req.body;

    try {
        const response = await fetch(LOGGLY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(logData),
        });

        if (response.ok) {
            res.status(200).send({ message: "Log forwarded to Loggly" });
        } else {
            console.error(`Failed to log to Loggly: ${response.statusText}`);
            res.status(response.status).send({ error: "Failed to log to Loggly" });
        }
    } catch (err) {
        console.error("Error forwarding log:", err);
        res.status(500).send({ error: "Internal Server Error" });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Logging server is running at http://localhost:${PORT}`);
});
