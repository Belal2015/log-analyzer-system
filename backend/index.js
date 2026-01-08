import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(cors());

const PORT = process.env.PORT || 5000;

// Log Analysis Logic
const analyzeLogs = (rawLogs) => {
    const lines = rawLogs.split('\n').filter(line => line.trim() !== '');
    const analysis = {
        totalLines: lines.length,
        severity: { ERROR: 0, WARN: 0, INFO: 0 },
        keywords: {},
        timestampsFound: 0
    };

    const timestampRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

    lines.forEach(line => {
        // Severity Detection
        if (line.toUpperCase().includes('ERROR')) analysis.severity.ERROR++;
        else if (line.toUpperCase().includes('WARN')) analysis.severity.WARN++;
        else if (line.toUpperCase().includes('INFO')) analysis.severity.INFO++;

        // Timestamp Detection
        if (timestampRegex.test(line)) analysis.timestampsFound++;

        // Simple Keyword Analysis (Common Tech keywords)
        const commonKeywords = ['database', 'network', 'auth', 'timeout', 'disk'];
        commonKeywords.forEach(kw => {
            if (line.toLowerCase().includes(kw)) {
                analysis.keywords[kw] = (analysis.keywords[kw] || 0) + 1;
            }
        });
    });

    return analysis;
};

app.post('/api/analyze', (req, res) => {
    const { logs } = req.body;
    if (!logs) {
        return res.status(400).json({ error: 'No log data provided' });
    }
    const result = analyzeLogs(logs);
    res.json(result);
});

// Health Check
app.get('/health', (req, res) => res.status(200).send('OK'));

// Graceful Shutdown
const server = app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

process.on('SIGTERM', () => {
    console.info('SIGTERM signal received. Closing HTTP server.');
    server.close(() => console.log('HTTP server closed.'));
});