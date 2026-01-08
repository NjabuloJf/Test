const express = require('express');
const app = express();
const { exec } = require('child_process');

app.use(express.json());

app.post('/deploy', (req, res) => {
  const config = req.body;
  // Example: Save config to .env or config file
  console.log('Deploy config:', config);

  if (config.repo === 'NjabuloJf/Njabulo_Jb') {
    // Example deploy logic (customize this)
    exec('git pull && npm start', (error, stdout, stderr) => {
      if (error) {
        res.status(500).json({ message: 'Error deploying' });
      } else {
        res.json({ message: 'Bot deployed successfully' });
      }
    });
  } else {
    res.status(400).json({ message: 'Invalid repo' });
  }
});

app.listen(3000, () => console.log('Server on port 3000'));

