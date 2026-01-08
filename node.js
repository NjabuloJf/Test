const express = require('express');
const app = express();
app.use(express.json());

app.post('/deploy', (req, res) => {
  try {
    const config = req.body;
    // Deploy logic here
    res.json({ message: 'Bot deployed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deploying bot', error: err.message });
  }
});

app.listen(3000, () => console.log('Server on port 3000'));

In index.html, check the logs for more info:
fetch('/deploy', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(config),
})
.then((res) => res.text()) // Try text to see full response
.then((data) => {
  logDiv.innerText += `Response: ${data}\n`;
})
.catch((err) => {
  logDiv.innerText += `Error: ${err.message}\n`;
});

