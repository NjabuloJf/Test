
document.getElementById('shorten-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const link = document.getElementById('link').value;
  const response = await fetch('/shorten', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ url: link })
  });
  const result = await response.json();
  const shortenedLink = `https://njabulo.eu.org/${result.short_url}`;
  const resultElement = document.getElementById('result');
  resultElement.innerHTML = `
    <p>Shortened link: <a href="${shortenedLink}">${shortenedLink}</a></p>
    <button id="copy-button">Copy</button>
  `;
  document.getElementById('copy-button').addEventListener('click', () => {
    navigator.clipboard.writeText(shortenedLink).then(() => {
      alert('Link copied to clipboard!');
    });
  });
});
