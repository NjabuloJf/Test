
const express = require('express');
const app = express();
app.use(express.json());

app.post('/deploy', (req, res) => {
  try {
    const config = req.body;
    console.log('Deploy config:', config);
    // Add your deploy logic here (e.g., save config, restart bot)
    res.json({ message: 'Bot deployed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deploying bot', error: err.message });
  }
});

app.listen(3000, () => console.log('Server on port 3000'));

