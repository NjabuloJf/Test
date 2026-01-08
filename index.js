
const express = require('express');
const app = express();
app.use(express.json());

app.get('/', (req, res) => res.send('Server is running'));

app.post('/deploy', (req, res) => {
  try {
    console.log('Deploy request:', req.body);
    const config = req.body;
    // Add your deploy logic here (e.g., save config, restart bot)
    res.json({ message: 'Bot deployed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));

