const express = require('express');
const app = express();
const PORT = 8080;

app.use(express.json()); // Parse JSON bodies

let planets = [
    {
        id: 1,
        name: 'Earth',
        logo: '🌍',
        emoji: '💧'
    },
    {
        id: 2,
        name: 'Mars',
        logo: '🔴',
        emoji: '👽'
    }
];

// Regex functions to validate name and emoji [grande profe emanuelle]
const isValidName = (name) => /^[A-Za-z\s]+$/.test(name);
const isValidEmoji = (emoji) => /\p{Emoji}/u.test(emoji);

// GET all planets
app.get('/planet', (req, res) => {
    res.status(200).send(planets);
});

// GET planet by ID
app.get('/planet/:id', (req, res) => {
    const { id } = req.params;
    const planet = planets.find(p => p.id === parseInt(id));
    if (!planet) {
        return res.status(404).send({ error: "Planet not found" });
    }
    res.status(200).send(planet);
});

// POST (Create)
app.post('/planet', (req, res) => {
    const { name, logo, emoji } = req.body;

    // Validate required fields
    if (!name || !logo || !emoji) {
        return res.status(400).send({ error: "Missing required fields: name, logo, emoji" });
    }

    // Validate name and emoji
    if (!isValidName(name)) {
        return res.status(400).send({ error: "Name must only contain letters and spaces" });
    }
    if (!isValidEmoji(logo) || !isValidEmoji(emoji)) {
        return res.status(400).send({ error: "Logo and emoji must be valid emojis" });
    }

    // Create new planet
    const newPlanet = {
        id: planets.length + 1,
        name,
        logo,
        emoji
    };

    planets.push(newPlanet);
    res.status(201).send(newPlanet);
});

// PUT (Update)
app.put('/planet/:id', (req, res) => {
    const { id } = req.params;
    const { name, logo, emoji } = req.body;
    const planetIndex = planets.findIndex(p => p.id === parseInt(id));

    if (planetIndex === -1) {
        return res.status(404).send({ error: "Planet not found" });
    }

    // Validate fields if they are provided
    if (name && !isValidName(name)) {
        return res.status(400).send({ error: "Name must only contain letters and spaces" });
    }
    if (logo && !isValidEmoji(logo)) {
        return res.status(400).send({ error: "Logo must be a valid emoji" });
    }
    if (emoji && !isValidEmoji(emoji)) {
        return res.status(400).send({ error: "Emoji must be a valid emoji" });
    }

    // Update the planet
    planets[planetIndex] = {
        id: parseInt(id),
        name: name || planets[planetIndex].name,
        logo: logo || planets[planetIndex].logo,
        emoji: emoji || planets[planetIndex].emoji
    };

    res.send(planets[planetIndex]);
});

// DELETE (Delete)
app.delete('/planet/:id', (req, res) => {
    const { id } = req.params;
    const initialLength = planets.length;
    planets = planets.filter(p => p.id !== parseInt(id));

    if (planets.length === initialLength) {
        return res.status(404).send({ error: "Planet not found" });
    }

    res.send({ message: `Planet ${id} deleted` });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/planet`);
});
