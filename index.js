
// Import
const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const PORT = 8080;

// Middleware, um JSON-Daten im Request-Body zu parsen
app.use(express.json());

// Listener für express-instanz
app.listen(
    PORT,
    () => console.log(`server ready at http://localhost:${PORT}`)
);

// TEST
app.get('/', (req, res) => {
    res.sendStatus(200);
});

/** GET */

/* 200 OK */ 
app.get('/api/test', (req, res) => {
    res.sendStatus(200);
});

/* JSON direct */ 
app.get('/api/json1', (req, res) => {
    res.send({ "key": "value" });
});

/* JSON ressource */ 
app.get('/api/json2', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'test.json'));
});

/* HTML */ 
app.get('/api/html', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'boo.html'));
});

/* JPG */ 
app.get('/api/jpg', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', '404.jpg'));
});

/** POST */

app.post('/api/post', (req, res) => {
    const requestData = req.body;
    console.log('Empfangene Daten:', requestData);

    res.status(201).json({
        message: 'Daten erfolgreich empfangen!',
        data: requestData,
    });
});
/** PUT */

// Aktualisiert / überschreibt Werte in src/test.json
app.put('/api/update', async (req, res) => {
    const filePath = path.join(__dirname, 'src', 'test.json');

    try {
        // 1. Bestehende Datei einlesen
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const currentData = JSON.parse(fileContent);

        // 2. Felder zusammenführen (z. B. occupation aktualisieren)
        const updatedData = { ...currentData, ...req.body };

        // 3. Zurück in die Datei schreiben
        await fs.writeFile(filePath, JSON.stringify(updatedData, null, 2), 'utf-8');

        // 4. Antwort an den Client
        res.status(200).json({
            message: 'Datei erfolgreich aktualisiert!',
            data: updatedData
        });
    } catch (error) {
        console.error('Fehler beim Aktualisieren der Datei:', error);
        res.status(500).json({ error: 'Fehler beim Bearbeiten der Datei' });
    }
});

