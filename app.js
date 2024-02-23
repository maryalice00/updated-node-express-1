const express = require('express');
const axios = require('axios');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Route to handle POST requests
app.post('/', async (req, res, next) => {
  try {
    const developers = req.body.developers;
    const results = await Promise.all(developers.map(async (d) => {
      const response = await axios.get(`https://api.github.com/users/${d}`);
      return response.data;
    }));

    const out = results.map(r => ({ name: r.name, bio: r.bio }));

    return res.json(out);
  } catch (err) {
    next(err);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
